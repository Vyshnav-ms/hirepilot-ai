"use client";

import { useState } from "react";
import { FileSearch, Lightbulb, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { sampleAtsAnalysis } from "@/lib/career-data";

export default function ResumeAnalysisPage() {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const suggestions = sampleAtsAnalysis.improvements;

  const runAnalysis = () => {
    if (!resumeText.trim()) {
      toast.error("Add a resume first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Resume analysis generated.");
    }, 500);
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-300">
          Resume Analysis
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Turn your resume into a stronger career asset.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Review strengths, weaknesses, missing skills, formatting gaps, and improvement suggestions.
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="glass-card rounded-2xl p-5">
          <ResumeUploader value={resumeText} onChange={setResumeText} />
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <FileSearch className="size-4" />}
            Analyze Resume
          </button>
        </div>
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <div key={item} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Lightbulb className="size-5 text-amber-200" />
                <h3 className="font-semibold">Improvement {index + 1}</h3>
              </div>
              <p className="mt-3 leading-7 text-zinc-400">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

