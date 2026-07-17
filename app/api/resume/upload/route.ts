import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";
import { extractResumeSections, textFromUploadedFile } from "@/lib/document-parsing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireApiUser(req);
    if (!isAuthContext(auth)) return auth;

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Resume file is required." }, { status: 400 });
    }

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
      return NextResponse.json({ success: false, error: "Upload a PDF or DOCX resume." }, { status: 400 });
    }

    const resumeText = await textFromUploadedFile(file);
    if (!resumeText) {
      return NextResponse.json({ success: false, error: "No readable resume text found." }, { status: 422 });
    }

    const ext = lowerName.endsWith(".docx") ? "docx" : "pdf";
    const path = `${auth.user.id}/master-resume.${ext}`;
    const bytes = await file.arrayBuffer();
    const { error: uploadError } = await auth.admin.storage.from("resumes").upload(path, bytes, {
      contentType: file.type || (ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      upsert: true,
    });

    if (uploadError) throw uploadError;

    const { data: signed } = await auth.admin.storage.from("resumes").createSignedUrl(path, 60 * 60 * 24 * 7);
    const sections = extractResumeSections(resumeText);

    const { data, error } = await auth.admin
      .from("master_resume")
      .upsert(
        {
          user_id: auth.user.id,
          resume_url: path,
          resume_text: resumeText,
          ...sections,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: { ...data, signedUrl: signed?.signedUrl ?? null } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume upload failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
