import { NextRequest, NextResponse } from "next/server";
import { extractEmails, sanitizeText, textFromUploadedFile } from "@/lib/document-parsing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let text = "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      text = sanitizeText(typeof body.text === "string" ? body.text : "");
    } else {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ success: false, error: "Job description file is required." }, { status: 400 });
      }
      text = await textFromUploadedFile(file);
    }

    if (!text) return NextResponse.json({ success: false, error: "No readable job description found." }, { status: 422 });
    return NextResponse.json({ success: true, data: { text, emails: extractEmails(text) } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job description parsing failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
