import { NextRequest, NextResponse } from "next/server";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfjsWorkerModule from "pdfjs-dist/legacy/build/pdf.worker.mjs";

export const runtime = "nodejs";

declare global {
  // PDF.js uses this global to run a fake worker in Node/serverless routes.
  var pdfjsWorker: typeof pdfjsWorkerModule | undefined;
}

globalThis.pdfjsWorker ||= pdfjsWorkerModule;

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

async function extractPdfText(data: Uint8Array) {
  const pdf = await getDocument({
    data,
    disableFontFace: true,
    useWorkerFetch: false,
  }).promise;

  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const textItems = content.items.filter(isTextItem) as PdfTextItem[];
    const pageText = textItems
      .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim();

    if (pageText) {
      pages.push(pageText);
    }

    page.cleanup();
  }

  await pdf.destroy();

  return pages.join("\n\n").trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No PDF uploaded" },
        { status: 400 }
      );
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const text = await extractPdfText(new Uint8Array(bytes));

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No readable text found in this PDF. If it is a scanned resume, please upload a text-based PDF.",
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
    const message = error instanceof Error ? error.message : "PDF extraction failed";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
