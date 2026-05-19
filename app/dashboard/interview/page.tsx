"use client";

import { useState } from "react";
import { BriefcaseBusiness, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { QuestionWorkspace } from "@/components/career/question-workspace";
import { emptyCareerResult, sampleCareerResult } from "@/lib/career-data";
import { CareerAnalysisResult } from "@/lib/career-types";
import { useCareerStore } from "@/lib/career-store";

export default function InterviewGeneratorPage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<CareerAnalysisResult | null>(null);
  const setLatestAnalysis = useCareerStore((state) => state.setLatestAnalysis);

  const analyze = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      toast.error("Add resume text and job description first.");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Interview generation failed");
      }

      const result = { ...emptyCareerResult, ...data.data };
      setAnalysis(result);
      setLatestAnalysis(result);
      toast.success("Interview workspace generated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Interview generation failed";
      toast.error(message);
      setAnalysis(sampleCareerResult);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
          Interview Question Generator
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Generate a complete role-specific interview plan.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Upload a resume PDF or paste text, add a target job description, and generate structured question sets with answers.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <ResumeUploader value={resumeText} onChange={setResumeText} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-3">
            <BriefcaseBusiness className="size-5 text-violet-300" />
            <h3 className="text-xl font-semibold">Job Description</h3>
          </div>
          <textarea
            value={jdText}
            onChange={(event) => setJdText(event.target.value)}
            placeholder="Paste the target job description here..."
            className="premium-input min-h-[380px] w-full resize-y rounded-xl p-4 leading-7"
          />
        </div>
      </section>

      <button
        type="button"
        onClick={analyze}
        disabled={loading}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black shadow-2xl shadow-violet-500/15 transition hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {loading ? "Generating 200 questions..." : "Generate Interview Questions"}
      </button>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="glass-card rounded-2xl p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-5 h-5 w-5/6 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {analysis && (
        <QuestionWorkspace
          technical={analysis.technicalQuestions}
          hr={analysis.hrQuestions}
          project={analysis.projectQuestions}
          scenario={analysis.scenarioQuestions}
          behavioral={analysis.behavioralQuestions}
        />
      )}
    </div>
  );
}

