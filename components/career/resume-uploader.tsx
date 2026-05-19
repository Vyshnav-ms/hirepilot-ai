"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { FileText, FileUp, Loader2, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ResumeUploader({
  value,
  onChange,
  label = "Resume",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const uploadFile = async (file: File | null) => {
    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Only PDF files are supported.");
      toast.error("Please upload a PDF resume.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("PDF must be smaller than 8MB.");
      toast.error("PDF must be smaller than 8MB.");
      return;
    }

    setFileName(file.name);
    setExtracting(true);
    setError("");
    setProgress(18);

    try {
      const formData = new FormData();
      formData.append("file", file);
      setProgress(44);

      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      });
      setProgress(78);

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "PDF extraction failed");
      }

      const text = typeof data.text === "string" ? data.text.trim() : "";
      if (!text) {
        throw new Error("No readable text found. Paste the resume text below instead.");
      }

      onChange(text);
      setProgress(100);
      toast.success("Resume text extracted.");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "PDF extraction failed.";
      setError(message);
      toast.error(message);
    } finally {
      setExtracting(false);
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    uploadFile(event.target.files?.[0] || null);
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    uploadFile(event.dataTransfer.files?.[0] || null);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.035] p-5 transition",
          dragging && "border-blue-300/70 bg-blue-500/10",
          extracting && "pointer-events-none opacity-80"
        )}
      >
        <input ref={inputRef} type="file" accept="application/pdf" onChange={handleInput} className="sr-only" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-[150px] w-full flex-col items-center justify-center text-center"
        >
          {extracting ? (
            <Loader2 className="size-9 animate-spin text-blue-200" />
          ) : (
            <FileUp className="size-9 text-blue-200" />
          )}
          <span className="mt-4 font-semibold">
            {extracting ? "Extracting resume text..." : `Upload or drop ${label} PDF`}
          </span>
          <span className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
            {fileName || "Supports text-based PDFs and modern resume templates. OCR fallback is planned for scanned resumes."}
          </span>
        </button>
        {progress > 0 && (
          <div className="absolute inset-x-5 bottom-4 h-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400"
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{error} You can paste resume text manually below.</p>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-zinc-300">
          <FileText className="size-4 text-zinc-500" />
          Extracted or pasted resume text
        </div>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Paste resume text here if PDF extraction is unavailable..."
          className="premium-input min-h-[180px] w-full resize-y rounded-xl p-4 leading-7"
        />
      </div>
    </div>
  );
}

