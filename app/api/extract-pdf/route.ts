import { NextRequest, NextResponse } from "next/server";
// pdf-parse v2 uses a class-based API: PDFParse({ data }) → .getText()
// The package is kept external (serverExternalPackages in next.config.ts)
// so Next.js won't bundle it – this is required because pdfjs-dist and
// @napi-rs/canvas must load as native Node.js modules at runtime.
import { PDFParse } from "pdf-parse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function extractPdfText(buffer: Buffer): Promise<string> {
  // pdf-parse v2: pass the buffer as `data` in LoadParameters
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  return result.text
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (
      !file ||
      typeof file !== "object" ||
      !("arrayBuffer" in file)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No PDF uploaded",
        },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    const isPdf =
      uploadedFile.type === "application/pdf" ||
      uploadedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF files are supported",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await uploadedFile.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const text = await extractPdfText(buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No readable text found in PDF",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text,
    });
  } catch (error: unknown) {
    console.error("PDF ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "PDF parsing failed",
      },
      { status: 500 }
    );
  }
}