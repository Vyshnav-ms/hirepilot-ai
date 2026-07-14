"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, FileText, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { downloadAsPdf, downloadAsDocx, type Section } from "@/lib/download-questions";
import type { InterviewResult } from "@/lib/career-types";

// ─── Types ────────────────────────────────────────────────────────────────────

type DownloadKey = `${Section | "all"}-${"pdf" | "docx"}`;

interface SectionOption {
  key: Section;
  label: string;
  count: number;
  color: string;
  dotColor: string;
}

// ─── PDF / DOCX Icon Badges ───────────────────────────────────────────────────

function PdfBadge({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title="Download PDF"
      className={cn(
        "flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/10 px-2 py-1 text-xs font-semibold text-red-300 transition",
        "hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-200",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <FileText className="size-3" />}
      PDF
    </button>
  );
}

function DocxBadge({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      title="Download DOCX"
      className={cn(
        "flex items-center gap-1 rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-xs font-semibold text-blue-300 transition",
        "hover:bg-blue-500/20 hover:border-blue-400/40 hover:text-blue-200",
        "disabled:opacity-40 disabled:cursor-not-allowed"
      )}
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <FileDown className="size-3" />}
      DOCX
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DownloadMenu({ result }: { result: InterviewResult }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<DownloadKey | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const totalCount =
    result.technicalQuestions.length +
    result.hrQuestions.length +
    result.projectQuestions.length +
    result.behavioralQuestions.length +
    result.scenarioQuestions.length;

  const sections: SectionOption[] = [
    { key: "technical",  label: "Technical",  count: result.technicalQuestions.length,  color: "text-blue-300",   dotColor: "bg-blue-400" },
    { key: "hr",         label: "HR",         count: result.hrQuestions.length,          color: "text-emerald-300",dotColor: "bg-emerald-400" },
    { key: "projects",   label: "Projects",   count: result.projectQuestions.length,     color: "text-amber-300",  dotColor: "bg-amber-400" },
    { key: "behavioral", label: "Behavioral", count: result.behavioralQuestions.length,  color: "text-pink-300",   dotColor: "bg-pink-400" },
    { key: "scenario",   label: "Scenario",   count: result.scenarioQuestions.length,    color: "text-violet-300", dotColor: "bg-violet-400" },
  ];

  const handle = async (key: DownloadKey, fn: () => Promise<void>) => {
    if (loading) return;
    setLoading(key);
    try {
      await fn();
      toast.success("Download started!");
    } catch (err) {
      console.error(err);
      toast.error("Download failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white",
          "transition hover:bg-white/[0.10] hover:border-white/20",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          open && "bg-white/[0.08] border-white/20"
        )}
      >
        <FileDown className="size-4 text-violet-400" />
        Export
        <ChevronDown
          className={cn("size-4 text-zinc-400 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute right-0 z-50 mt-2 w-80 origin-top-right",
              "rounded-2xl border border-white/10 bg-zinc-900/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Export Questions
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                {totalCount}
              </span>
            </div>

            <div className="p-2">
              {/* ── Download All ────────────────────────────────────────── */}
              <div className="mb-1 px-2 pb-1 pt-2">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  All Sections
                </p>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-violet-500/20">
                      <FileDown className="size-4 text-violet-300" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">All Questions</p>
                      <p className="text-[10px] text-zinc-500">{totalCount} questions · 5 sections</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <PdfBadge
                      loading={loading === "all-pdf"}
                      onClick={() =>
                        handle("all-pdf", () => downloadAsPdf(result))
                      }
                    />
                    <DocxBadge
                      loading={loading === "all-docx"}
                      onClick={() =>
                        handle("all-docx", () => downloadAsDocx(result))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-1 border-t border-white/[0.06]" />

              {/* ── Per Section ─────────────────────────────────────────── */}
              <div className="px-2 pb-2 pt-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  By Section
                </p>
                <div className="space-y-1">
                  {sections.map((sec) => (
                    <div
                      key={sec.key}
                      className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={cn("size-2 rounded-full", sec.dotColor)} />
                        <div>
                          <span className={cn("text-xs font-semibold", sec.color)}>
                            {sec.label}
                          </span>
                          <span className="ml-2 text-[10px] text-zinc-500">
                            {sec.count} qs
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <PdfBadge
                          loading={loading === `${sec.key}-pdf`}
                          onClick={() =>
                            handle(
                              `${sec.key}-pdf` as DownloadKey,
                              () => downloadAsPdf(result, sec.key)
                            )
                          }
                        />
                        <DocxBadge
                          loading={loading === `${sec.key}-docx`}
                          onClick={() =>
                            handle(
                              `${sec.key}-docx` as DownloadKey,
                              () => downloadAsDocx(result, sec.key)
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
