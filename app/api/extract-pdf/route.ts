import { NextRequest, NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Disable worker in server environment
pdfjsLib.GlobalWorkerOptions.workerSrc = "";

type PdfTextItem = {
  str: string;
  hasEOL?: boolean;
};

function isTextItem(item: unknown): item is PdfTextItem {
  return (
    typeof item === "object" &&
    item !== null &&
    "str" in item &&
    typeof (item as PdfTextItem).str === "string"
  );
}

async function extractPdfText(data: Uint8Array): Promise<string> {
  const loadingTask = pdfjsLib.getDocument({
  data,
  disableFontFace: true,
  useWorkerFetch: false,
  verbosity: 0,
});

  const pdf = await loadingTask.promise;

  try {
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      try {
        const textContent = await page.getTextContent();

        const textItems = textContent.items.filter(
          isTextItem
        ) as PdfTextItem[];

        const pageText = textItems
          .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
          .join("")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/[ \t]{2,}/g, " ")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        if (pageText.length > 0) {
          pages.push(pageText);
        }
      } finally {
        page.cleanup();
      }
    }

    return pages.join("\n\n").trim();
  } finally {
    await pdf.destroy();
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    // Production-safe validation
    if (
      !file ||
      typeof file !== "object" ||
      !("arrayBuffer" in file)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "No PDF file uploaded",
        },
        { status: 400 }
      );
    }

    const uploadedFile = file as File;

    // Validate PDF
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

    // 10MB limit
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    if (uploadedFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "File size exceeds 10MB limit",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await uploadedFile.arrayBuffer();

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Uploaded file is empty",
        },
        { status: 400 }
      );
    }

    const uint8Array = new Uint8Array(arrayBuffer);

    const extractedText = await extractPdfText(uint8Array);

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No readable text found in this PDF. Please upload a text-based PDF.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        text: extractedText,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("PDF PARSE ERROR:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to parse PDF";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}