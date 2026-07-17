import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";
import { groq } from "@/lib/ai-json";
import { EMAIL_DRAFT_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const regenerateSchema = z.object({
  applicationId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiUser(req);
    if (!isAuthContext(auth)) return auth;

    const body = regenerateSchema.parse(await req.json());

    // Fetch the application
    const { data: application, error: appError } = await auth.admin
      .from("applications")
      .select("*")
      .eq("id", body.applicationId)
      .eq("user_id", auth.user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
    }

    // Fetch master resume
    const { data: resume, error: resumeError } = await auth.admin
      .from("master_resume")
      .select("*")
      .eq("user_id", auth.user.id)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json({ success: false, error: "Master resume not found." }, { status: 404 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "AI service is not configured." }, { status: 503 });
    }

    const emailPrompt = `
Master Resume:
${resume.resume_text}

Job Description:
${application.job_description}

Candidate Email: ${auth.user.email}
`;

    const emailCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: EMAIL_DRAFT_SYSTEM_PROMPT },
        { role: "user", content: emailPrompt },
      ],
      temperature: 0.5,
      top_p: 0.9,
      max_tokens: 1500,
      response_format: { type: "json_object" },
    });

    const parsedEmail = JSON.parse(emailCompletion.choices[0]?.message?.content ?? "{}") as { subject?: string; email?: string };

    const subject = parsedEmail.subject || application.email_subject;
    const bodyText = parsedEmail.email || application.email_body;

    // Update the application
    const { data: updatedApp, error: updateError } = await auth.admin
      .from("applications")
      .update({
        email_subject: subject,
        email_body: bodyText,
      })
      .eq("id", body.applicationId)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, data: { subject, body: bodyText } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Email regeneration failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
