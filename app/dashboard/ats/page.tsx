"use client";

import { useState } from "react";
import { BriefcaseBusiness, Loader2, ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { AtsReport } from "@/components/career/ats-report";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { sampleAtsAnalysis } from "@/lib/career-data";
import { AtsAnalysis } from "@/lib/career-types";

export default function AtsCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const runAts = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      toast.error("Add resume and job description first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "ATS analysis failed");
      }
      setAnalysis(data.data);
      toast.success("ATS report generated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "ATS analysis failed";
      toast.error(message);
      setAnalysis(sampleAtsAnalysis);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
          ATS Score Checker
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Measure resume fit before you apply.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Analyze keyword alignment, section completeness, formatting strength, and skill gaps against a target role.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <ResumeUploader value={resumeText} onChange={setResumeText} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <BriefcaseBusiness className="size-5 text-violet-300" />
            <h3 className="text-xl font-semibold">Target Job Description</h3>
          </div>
          <textarea
            value={jdText}
            onChange={(event) => setJdText(event.target.value)}
            placeholder="Paste the job description for ATS comparison..."
            className="premium-input min-h-[380px] w-full resize-y rounded-xl p-4 leading-7"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={runAts}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <ScanSearch className="size-4" />}
        {loading ? "Scoring resume..." : "Generate ATS Report"}
      </button>

      {analysis && <AtsReport analysis={analysis} />}
    </div>
  );
}

