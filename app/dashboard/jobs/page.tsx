"use client";

import { useMemo, useState } from "react";
import { BriefcaseBusiness, DatabaseZap, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { JobCards } from "@/components/career/job-cards";
import { ResumeUploader } from "@/components/career/resume-uploader";
import { sampleJobs } from "@/lib/career-data";
import { RecommendedJob } from "@/lib/career-types";
import { ScrapedJob } from "@/lib/jobs/types";

function scrapedToRecommendedJob(job: ScrapedJob): RecommendedJob {
  return {
    id: job.externalId,
    company: job.company,
    role: job.title,
    salary: job.salary || "Not listed",
    location: job.location,
    source: job.source,
    matchPercentage: 78,
    workMode: job.remoteType === "Unknown" ? "Hybrid" : job.remoteType,
    level: "Mid",
    skills: job.tags.length > 0 ? job.tags.slice(0, 5) : ["Role match", "Career fit"],
    applyUrl: job.applyUrl,
  };
}

export default function JobRecommendationsPage() {
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("All");
  const [jobs, setJobs] = useState<RecommendedJob[]>(sampleJobs);
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);

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

  const scrapeJobs = async () => {
    setScraping(true);

    try {
      const response = await fetch("/api/jobs/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Job scraping failed");
      }

      const scrapedJobs = (data.data.jobs as ScrapedJob[]).map(scrapedToRecommendedJob);

      if (scrapedJobs.length === 0) {
        throw new Error("No jobs were scraped from the configured sources.");
      }

      setJobs(scrapedJobs);
      toast.success(`Scraped ${scrapedJobs.length} real jobs.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Job scraping failed";
      toast.error(message);
    } finally {
      setScraping(false);
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
          <button
            type="button"
            onClick={scrapeJobs}
            disabled={scraping}
            className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-6 font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-60"
          >
            {scraping ? <Loader2 className="size-4 animate-spin" /> : <DatabaseZap className="size-4" />}
            {scraping ? "Scraping real jobs..." : "Scrape Real Jobs"}
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
