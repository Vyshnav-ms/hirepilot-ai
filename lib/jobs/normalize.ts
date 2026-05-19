import crypto from "crypto";
import { ScrapedJob } from "@/lib/jobs/types";

export function cleanText(value: string | undefined | null) {
  return (value || "").replace(/\s+/g, " ").trim();
}

export function detectRemoteType(value: string): ScrapedJob["remoteType"] {
  const normalized = value.toLowerCase();

  if (normalized.includes("remote")) {
    return "Remote";
  }

  if (normalized.includes("hybrid")) {
    return "Hybrid";
  }

  if (normalized.includes("onsite") || normalized.includes("on-site")) {
    return "On-site";
  }

  return "Unknown";
}

export function makeJobId(parts: string[]) {
  return crypto
    .createHash("sha256")
    .update(parts.map((part) => part.toLowerCase().trim()).join("|"))
    .digest("hex");
}

export function dedupeJobs(jobs: ScrapedJob[]) {
  const seen = new Set<string>();
  const deduped: ScrapedJob[] = [];

  for (const job of jobs) {
    const key = job.externalId || makeJobId([job.title, job.company, job.location, job.applyUrl]);

    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(job);
    }
  }

  return deduped;
}

