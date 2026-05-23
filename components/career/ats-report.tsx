"use client";

import { ShieldCheck } from "lucide-react";
import { AtsAnalysis } from "@/lib/career-types";
import { cn } from "@/lib/utils";

export function AtsReport({ analysis }: { analysis: AtsAnalysis }) {
  const breakdown = [
    { label: "Skills Match", value: analysis.breakdown.skillsMatch, color: "bg-blue-400" },
    { label: "Experience Match", value: analysis.breakdown.experienceMatch, color: "bg-emerald-400" },
    { label: "Education Match", value: analysis.breakdown.educationMatch, color: "bg-violet-400" },
    { label: "Keyword Match", value: analysis.breakdown.keywordMatch, color: "bg-orange-400" },
    { label: "Formatting Score", value: analysis.breakdown.formattingScore, color: "bg-pink-400" },
  ];

  const scoreColor =
    analysis.score >= 75
      ? "rgb(52 211 153)"
      : analysis.score >= 50
      ? "rgb(251 191 36)"
      : "rgb(248 113 113)";

  return (
    <div className="space-y-5">
      {/* Score + Breakdown row */}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Circular Score */}
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-6 text-center">
          <div
            className="relative grid size-36 place-items-center rounded-full"
            style={{
              background: `conic-gradient(${scoreColor} ${analysis.score * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
            }}
          >
            <div className="absolute inset-3 grid place-items-center rounded-full bg-black/80">
              <div>
                <p className="text-3xl font-bold">{analysis.score}</p>
                <p className="text-xs text-zinc-400">/ 100</p>
              </div>
            </div>
          </div>
          <ShieldCheck className="mt-4 size-5 text-blue-300" />
          <p className="mt-1 text-sm font-semibold">ATS Match Score</p>
          <p className={cn(
            "mt-1 text-xs font-medium",
            analysis.score >= 75 ? "text-emerald-300" : analysis.score >= 50 ? "text-amber-300" : "text-red-300"
          )}>
            {analysis.score >= 75 ? "Strong Match" : analysis.score >= 50 ? "Moderate Match" : "Low Match"}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-5 font-semibold">Score Breakdown</h3>
          <div className="space-y-4">
            {breakdown.map(({ label, value, color }) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-zinc-300">{label}</span>
                  <span className="font-semibold text-white">{value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", color)}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keywords + Skills */}
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { title: "Matched Keywords", items: analysis.matchedKeywords, chipClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" },
          { title: "Missing Keywords", items: analysis.missingKeywords, chipClass: "border-amber-500/25 bg-amber-500/10 text-amber-300" },
          { title: "Missing Skills", items: analysis.missingSkills, chipClass: "border-red-500/25 bg-red-500/10 text-red-300" },
        ].map(({ title, items, chipClass }) => (
          <div key={title} className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 font-semibold">{title}</h3>
            {items.length === 0 ? (
              <p className="text-sm text-zinc-500">None identified.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className={cn("rounded-full border px-3 py-1 text-xs font-medium", chipClass)}>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Strengths + Improvements */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Strengths */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Strengths</h3>
          {analysis.strengths.length === 0 ? (
            <p className="text-sm text-zinc-500">No strengths identified.</p>
          ) : (
            <ul className="space-y-2">
              {analysis.strengths.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3 text-sm text-zinc-300">
                  <span className="mt-0.5 text-emerald-400">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommendations */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Recommendations</h3>
          {analysis.improvements.length === 0 ? (
            <p className="text-sm text-zinc-500">No recommendations available.</p>
          ) : (
            <ul className="space-y-2">
              {analysis.improvements.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl border border-blue-500/15 bg-blue-500/[0.06] p-3 text-sm text-zinc-300">
                  <span className="mt-0.5 text-blue-400">→</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Section Completeness */}
      {analysis.sectionCompleteness.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="mb-4 font-semibold">Section Completeness</h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.sectionCompleteness.map((item) => (
              <div key={item.section} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <span className="text-sm text-zinc-300">{item.section}</span>
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                  item.status === "Strong" && "bg-emerald-500/15 text-emerald-300",
                  item.status === "Partial" && "bg-amber-500/15 text-amber-300",
                  item.status === "Missing" && "bg-red-500/15 text-red-300"
                )}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
