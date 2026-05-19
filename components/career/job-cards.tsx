"use client";

import { Bookmark, ExternalLink, MapPin } from "lucide-react";
import { RecommendedJob } from "@/lib/career-types";
import { useCareerStore } from "@/lib/career-store";
import { cn } from "@/lib/utils";

export function JobCards({ jobs }: { jobs: RecommendedJob[] }) {
  const { savedJobs, toggleSavedJob } = useCareerStore();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {jobs.map((job) => {
        const saved = savedJobs.some((item) => item.id === job.id) || job.saved;
        return (
          <article key={job.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-400">{job.company}</p>
                <h3 className="mt-1 text-xl font-semibold">{job.role}</h3>
              </div>
              <button
                type="button"
                onClick={() => toggleSavedJob(job)}
                className={cn(
                  "rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/10",
                  saved && "text-amber-200"
                )}
                aria-label="Save job"
              >
                <Bookmark className={cn("size-4", saved && "fill-current")} />
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">
                {job.matchPercentage}% match
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-zinc-300">{job.salary}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-zinc-300">
                <MapPin className="size-3" />
                {job.location}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 text-zinc-300">{job.workMode}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span key={skill} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400">
                  {skill}
                </span>
              ))}
            </div>
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Apply via {job.source}
              <ExternalLink className="size-4" />
            </a>
          </article>
        );
      })}
    </div>
  );
}

