"use client";

import { Download, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AtsAnalysis } from "@/lib/career-types";
import { cn } from "@/lib/utils";

export function AtsReport({ analysis }: { analysis: AtsAnalysis }) {
  const breakdown = [
    ["Skills Match", analysis.breakdown.skillsMatch, "bg-blue-400"],
    ["Experience Match", analysis.breakdown.experienceMatch, "bg-emerald-400"],
    ["Education Match", analysis.breakdown.educationMatch, "bg-violet-400"],
    ["Keyword Match", analysis.breakdown.keywordMatch, "bg-orange-400"],
    ["Formatting Score", analysis.breakdown.formattingScore, "bg-pink-400"],
  ] as const;

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">ATS Match Score</p>
            <h2 className="mt-2 text-4xl font-semibold">{analysis.score}/100</h2>
          </div>
          <div
            className="grid size-28 place-items-center rounded-full"
            style={{
              background: `conic-gradient(rgb(96 165 250) ${analysis.score * 3.6}deg, rgb(255 255 255 / 0.08) 0deg)`,
            }}
          >
            <div className="grid size-20 place-items-center rounded-full bg-black/80">
              <ShieldCheck className="size-8 text-blue-200" />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => toast.success("ATS report export is queued.")}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:scale-[1.01]"
        >
          <Download className="size-4" />
          Download ATS Report
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-semibold">Score Breakdown</h3>
        <div className="mt-5 space-y-4">
          {breakdown.map(([label, value, color]) => (
            <div key={label}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-zinc-300">{label}</span>
                <span className="text-white">{value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 lg:col-span-2">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Matched Keywords", analysis.matchedKeywords, "text-emerald-200"],
            ["Missing Keywords", analysis.missingKeywords, "text-amber-200"],
            ["Missing Skills", analysis.missingSkills, "text-pink-200"],
          ].map(([title, items, color]) => (
            <div key={title as string}>
              <h3 className="font-semibold">{title as string}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(items as string[]).map((item) => (
                  <span
                    key={item}
                    className={cn("rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm", color as string)}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:col-span-2 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Improvement Suggestions</h3>
          <div className="mt-4 space-y-3">
            {analysis.improvements.map((item) => (
              <p key={item} className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm leading-6 text-zinc-300">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-semibold">Section Completeness</h3>
          <div className="mt-4 space-y-3">
            {analysis.sectionCompleteness.map((item) => (
              <div key={item.section} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <span className="text-sm text-zinc-300">{item.section}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

