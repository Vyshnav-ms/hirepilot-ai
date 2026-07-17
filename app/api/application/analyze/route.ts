import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";
import { groq } from "@/lib/ai-json";
import { extractEmails, sanitizeText } from "@/lib/document-parsing";
import { JobApplicationAnalysis } from "@/lib/application-types";
import { EMAIL_DRAFT_SYSTEM_PROMPT } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const analyzeSchema = z.object({
  jobDescription: z.string().min(30),
  hrEmail: z.email().optional().nullable(),
});

const FALLBACK: JobApplicationAnalysis = {
  atsScore: 0,
  keywordMatch: 0,
  experienceMatch: 0,
  educationMatch: 0,
  projectsMatch: 0,
  matchingSkills: [],
  missingSkills: [],
  recommendedSkills: [],
  summary: null,
  resumeWeaknesses: [],
  resumeStrengths: [],
  importantKeywords: [],
  emailSubject: "",
  professionalEmail: "",
  coverLetter: "",
  suggestedInterviewQuestions: [],
  improvementSuggestions: [],
  company: null,
  role: null,
  confidence: 0,
};

export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiUser(req);
    if (!isAuthContext(auth)) return auth;

    const body = analyzeSchema.parse(await req.json());
    const jobDescription = sanitizeText(body.jobDescription);
    const { data: resume, error: resumeError } = await auth.admin
      .from("master_resume")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (resumeError) throw resumeError;
    if (!resume) {
      return NextResponse.json({ success: false, error: "Upload your master resume before creating an application." }, { status: 409 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "AI service is not configured. Please set GROQ_API_KEY." }, { status: 503 });
    }

    const prompt = `You are HirePilot AI, an expert job application assistant.

Compare the supplied RESUME and JOB DESCRIPTION only. Never invent facts. If company, role, education, or experience details are missing, return null.

RESUME:
${resume.resume_text}

JOB DESCRIPTION:
${jobDescription}

Return ONLY strict JSON with this shape:
{
  "atsScore": 0,
  "keywordMatch": 0,
  "experienceMatch": 0,
  "educationMatch": 0,
  "projectsMatch": 0,
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "recommendedSkills": ["string"],
  "summary": "string or null",
  "resumeWeaknesses": ["string"],
  "resumeStrengths": ["string"],
  "importantKeywords": ["string"],
  "emailSubject": "string",
  "professionalEmail": "string",
  "coverLetter": "string",
  "suggestedInterviewQuestions": ["string"],
  "improvementSuggestions": [{ "text": "string", "priority": "High | Medium | Low" }],
  "company": "string or null",
  "role": "string or null",
  "confidence": 0
}

Rules:
- Scores are 0-100 integers.
- confidence is 0-100 and reflects how certain the analysis is from the supplied text.
- professionalEmail must be a concise HR/recruiter application email, not markdown.
- improvementSuggestions must be concrete resume edits.
- Use null when information is missing.
- Return raw JSON only.`;

    const emailPrompt = `
Master Resume:
${resume.resume_text}

Job Description:
${jobDescription}

Candidate Email: ${auth.user.email}
`;

    const [analysisCompletion, emailCompletion] = await Promise.all([
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return strict JSON only. Do not return markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        top_p: 0.8,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      }),
      groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: EMAIL_DRAFT_SYSTEM_PROMPT },
          { role: "user", content: emailPrompt },
        ],
        temperature: 0.5,
        top_p: 0.9,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    ]);

    const parsed = { ...FALLBACK, ...JSON.parse(analysisCompletion.choices[0]?.message?.content ?? "{}") } as JobApplicationAnalysis;
    const parsedEmail = JSON.parse(emailCompletion.choices[0]?.message?.content ?? "{}") as { subject?: string; email?: string };

    if (parsedEmail.subject) parsed.emailSubject = parsedEmail.subject;
    if (parsedEmail.email) parsed.professionalEmail = parsedEmail.email;

    const emails = extractEmails(jobDescription);

    const { data: application, error } = await auth.admin
      .from("applications")
      .insert({
        user_id: auth.user.id,
        company: parsed.company,
        role: parsed.role,
        job_description: jobDescription,
        ats_score: parsed.atsScore,
        missing_skills: parsed.missingSkills,
        matching_skills: parsed.matchingSkills,
        keywords: parsed.importantKeywords,
        email_subject: parsed.emailSubject,
        email_body: parsed.professionalEmail,
        hr_email: body.hrEmail ?? emails[0] ?? null,
        resume_url: resume.resume_url,
        status: "Draft",
        analysis_json: parsed,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: { application, analysis: parsed, emails } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Application analysis failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
