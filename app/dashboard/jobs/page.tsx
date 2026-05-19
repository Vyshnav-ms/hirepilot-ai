"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { JobCards } from "@/components/career/job-cards";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { sampleJobs } from "@/lib/career-data";
import { RecommendedJob } from "@/lib/career-types";

export default function JobRecommendationsPage() {
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("All");
  const [jobs, setJobs] = useState<RecommendedJob[]>(sampleJobs);
  const [loading, setLoading] = useState(false);

  const filteredJobs = useMemo(
    () => jobs.filter((job) => mode === "All" || job.workMode === mode),
    [jobs, mode]
  );

  const recommend = async () => {
    if (!resumeText.trim() && !skills.trim()) {
      toast.error("Add resume text or skills first.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, skills, experience }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Job recommendations failed");
      }
      setJobs(data.data);
      toast.success("Job recommendations generated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Job recommendations failed";
      toast.error(message);
      setJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
          AI Job Recommendations
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Discover roles that match your career signal.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Generate skill-based job matches with salary estimates, source labels, location filters, and saveable cards.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-2xl p-5">
          <ResumeUploader value={resumeText} onChange={setResumeText} />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xl font-semibold">Candidate Signals</h3>
          <input
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="Skills: React, TypeScript, Supabase..."
            className="premium-input mt-4 h-12 w-full rounded-xl px-4"
          />
          <textarea
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            placeholder="Experience level, preferred roles, locations..."
            className="premium-input mt-4 min-h-[180px] w-full resize-y rounded-xl p-4 leading-7"
          />
          <button
            type="button"
            onClick={recommend}
            disabled={loading}
            className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <BriefcaseBusiness className="size-4" />}
            {loading ? "Matching jobs..." : "Generate Job Matches"}
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input placeholder="Search job cards..." className="premium-input h-11 w-full rounded-xl pl-10 pr-3" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Remote", "Hybrid", "On-site"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-lg border border-white/10 px-3 py-2 text-sm transition ${mode === item ? "bg-white text-black" : "text-zinc-300 hover:bg-white/10"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <JobCards jobs={filteredJobs} />
    </div>
  );
}

