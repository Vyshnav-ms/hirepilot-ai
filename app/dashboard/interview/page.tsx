"use client";

import { useState } from "react";
import { BriefcaseBusiness, Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { QuestionWorkspace } from "@/components/career/question-workspace";
import { InterviewResult } from "@/lib/career-types";
import { useCareerStore } from "@/lib/career-store";

export default function InterviewGeneratorPage() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const setLatestResult = useCareerStore((state) => state.setLatestResult);

  const totalQuestions = result
    ? result.technicalQuestions.length +
      result.hrQuestions.length +
      result.projectQuestions.length +
      result.behavioralQuestions.length +
      result.scenarioQuestions.length
    : 0;

  const generate = async () => {
    if (!resumeText.trim()) { toast.error("Please upload or paste your resume text."); return; }
    if (!jdText.trim()) { toast.error("Please paste a job description."); return; }
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      const parsed = data.data as InterviewResult;
      setResult(parsed);
      setLatestResult(parsed);
      const counted =
        parsed.technicalQuestions.length +
        parsed.hrQuestions.length +
        parsed.projectQuestions.length +
        parsed.behavioralQuestions.length +
        parsed.scenarioQuestions.length;
      toast.success(`Generated ${counted} personalized questions across 5 categories.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Interview Generator
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Generate your personalized interview plan.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          Provide your resume and the job description. The AI compares both and generates 250 tailored questions across Technical, HR, Projects, Behavioral, and Scenario categories.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-violet-100 dark:bg-violet-500/20">
              <MessageSquareText className="size-4 text-violet-600 dark:text-violet-300" />
            </div>
            <h3 className="font-semibold text-foreground">Resume</h3>
          </div>
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
            id="jd-input"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the target job description here...&#10;&#10;Include role requirements, responsibilities, required skills and technologies."
            className="premium-input min-h-[340px] flex-1 w-full resize-y rounded-xl p-4 text-sm leading-7"
          />
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
            {jdText.trim().split(/\s+/).filter(Boolean).length} words
          </p>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          id="generate-interview-btn"
          className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-zinc-900 dark:bg-white px-7 font-semibold text-white dark:text-black shadow-2xl shadow-violet-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="size-4 animate-spin" /> Generating 5 question sets in parallel...</>
          ) : (
            <><Sparkles className="size-4" /> Generate Interview Questions</>
          )}
        </button>
        {result && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">{totalQuestions}</span> questions generated
          </p>
        )}
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card animate-pulse rounded-2xl p-5">
              <div className="mb-3 h-3 w-20 rounded-full bg-zinc-200 dark:bg-white/10" />
              <div className="h-4 w-4/5 rounded bg-zinc-100 dark:bg-white/10" />
              <div className="mt-2 h-3 w-full rounded bg-zinc-100 dark:bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && !result && (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-white/[0.02] p-12 text-center">
          <Sparkles className="mx-auto size-12 text-zinc-300 dark:text-zinc-700" />
          <p className="mt-4 text-base font-semibold text-zinc-500 dark:text-zinc-300">
            No interview session generated yet.
          </p>
          <p className="mt-2 text-sm text-zinc-400 dark:text-zinc-500">
            Upload your resume and paste a job description above, then click &quot;Generate Interview Questions&quot;.
          </p>
        </div>
      )}

      {result && !loading && <QuestionWorkspace result={result} />}
    </div>
  );
}
