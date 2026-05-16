import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

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

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const pdfParser = new PDFParser();

    const text: string = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData: Error | { parserError: Error }) => {
        reject(errData instanceof Error ? errData : errData.parserError);
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const extractedText = pdfParser.getRawTextContent();

        resolve(extractedText);
      });

      pdfParser.parseBuffer(buffer);
    });

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
