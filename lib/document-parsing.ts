import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import * as pdfjsWorkerModule from "pdfjs-dist/legacy/build/pdf.worker.mjs";
import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import { z } from "zod";
import { ResumeSectionJson } from "@/lib/application-types";

declare global {
  var pdfjsWorker: typeof pdfjsWorkerModule | undefined;
}

globalThis.pdfjsWorker ||= pdfjsWorkerModule;

type PdfTextItem = {
  str: string;
  hasEOL?: boolean;
};

function isTextItem(item: unknown): item is PdfTextItem {
  return typeof item === "object" && item !== null && "str" in item && typeof (item as PdfTextItem).str === "string";
}

export async function extractPdfText(data: Uint8Array): Promise<string> {
  const pdf = await getDocument({ data, disableFontFace: true, useWorkerFetch: false }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const textItems = content.items.filter(isTextItem) as PdfTextItem[];
    const text = textItems
      .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
      .join("")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (text) pages.push(text);
    page.cleanup();
  }

  await pdf.destroy();
  return sanitizeText(pages.join("\n\n"));
}

export async function extractDocxText(data: Uint8Array): Promise<string> {
  const result = await mammoth.extractRawText({ buffer: Buffer.from(data) });
  return sanitizeText(result.value);
}

export async function extractImageText(data: Uint8Array): Promise<string> {
  const worker = await createWorker("eng");
  try {
    const result = await worker.recognize(Buffer.from(data));
    return sanitizeText(result.data.text);
  } finally {
    await worker.terminate();
  }
}

export function sanitizeText(text: string) {
  return text.replace(/\u0000/g, "").replace(/[ \t]{2,}/g, " ").replace(/\n{4,}/g, "\n\n").trim();
}

export const uploadFileSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  size: z.number().max(8 * 1024 * 1024, "Files must be 8MB or smaller."),
});

export function extractEmails(text: string) {
  return Array.from(new Set(text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []));
}

function sectionAfter(text: string, labels: string[]) {
  const escaped = labels.map((label) => label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const re = new RegExp(`(?:^|\\n)\\s*(${escaped})\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Z /&-]{2,}\\s*:?\\s*\\n|$)`, "i");
  return re.exec(text)?.[2]?.trim() ?? "";
}

function splitSection(section: string, fallbackText = ""): ResumeSectionJson {
  const source = section || fallbackText;
  const items = source
    .split(/\n|•|- /)
    .map((item) => item.trim().replace(/^[-•]\s*/, ""))
    .filter((item) => item.length > 2)
    .slice(0, 20);

  return { items, summary: items[0] ?? null };
}

export function extractResumeSections(text: string) {
  const skills = sectionAfter(text, ["skills", "technical skills", "core skills"]);
  const education = sectionAfter(text, ["education", "academic background"]);
  const experience = sectionAfter(text, ["experience", "work experience", "professional experience", "employment"]);
  const projects = sectionAfter(text, ["projects", "selected projects", "personal projects"]);

  return {
    skills_json: splitSection(skills),
    education_json: splitSection(education),
    experience_json: splitSection(experience),
    projects_json: splitSection(projects),
  };
}

export async function textFromUploadedFile(file: File): Promise<string> {
  const metadata = uploadFileSchema.parse({ name: file.name, type: file.type, size: file.size });
  const lowerName = metadata.name.toLowerCase();
  const bytes = new Uint8Array(await file.arrayBuffer());

  if (metadata.type === "application/pdf" || lowerName.endsWith(".pdf")) return extractPdfText(bytes);
  if (metadata.type.includes("word") || lowerName.endsWith(".docx")) return extractDocxText(bytes);
  if (metadata.type.startsWith("image/")) return extractImageText(bytes);

  throw new Error("Unsupported file type.");
}
