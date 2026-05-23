"use client";

import { useState } from "react";
import { BriefcaseBusiness, Loader2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { AtsReport } from "@/components/career/ats-report";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { AtsAnalysis } from "@/lib/career-types";

export default function AtsCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runAts = async () => {
    if (!resumeText.trim()) { toast.error("Please upload or paste your resume."); return; }
    if (!jdText.trim()) { toast.error("Please paste a job description."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ATS analysis failed");
      setAnalysis(data.data);
      toast.success("ATS report generated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ATS analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          ATS Score Checker
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Measure your resume&apos;s ATS fit.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          Compare your resume against a job description. Get your ATS compatibility score, keyword gaps, missing skills, and AI-powered improvement recommendations.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <ResumeUploader value={resumeText} onChange={setResumeText} />
        </div>
        <div className="glass-card flex flex-col rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
              <BriefcaseBusiness className="size-4 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="font-semibold text-foreground">Job Description</h3>
          </div>
          <textarea
            id="ats-jd-input"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the target job description here...&#10;&#10;The AI will compare it against your resume to generate an ATS score."
            className="premium-input min-h-[340px] flex-1 w-full resize-y rounded-xl p-4 text-sm leading-7"
          />
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            {jdText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </section>

      <button
        type="button"
        id="generate-ats-btn"
        onClick={runAts}
        disabled={loading}
        className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-zinc-900 dark:bg-white px-7 font-semibold text-white dark:text-black shadow-2xl shadow-blue-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="size-4 animate-spin" /> Analyzing resume...</>
        ) : (
          <><ScanSearch className="size-4" /> Generate ATS Report</>
        )}
      </button>

      {!loading && !analysis && (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-white/[0.02] p-12 text-center">
          <ScanSearch className="mx-auto size-12 text-zinc-300 dark:text-zinc-700" />
          <p className="mt-4 text-base font-semibold text-zinc-500 dark:text-zinc-300">No ATS reports available.</p>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Upload your resume and paste a job description above, then click &quot;Generate ATS Report&quot;.
          </p>
        </div>
      )}

      {analysis && !loading && <AtsReport analysis={analysis} />}
    </div>
  );
}
