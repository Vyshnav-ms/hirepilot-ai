import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { JobSourceConfig, ScrapedJob } from "@/lib/jobs/types";

export async function persistScrapedJobs({
  source,
  jobs,
}: {
  source: JobSourceConfig;
  jobs: ScrapedJob[];
}) {
  const supabase = createSupabaseAdmin();

  if (!supabase) {
    return { saved: 0, skipped: true };
  }

  await supabase.from("job_sources").upsert(
    {
      id: source.id,
      name: source.name,
      source_type: source.type,
      url: source.url,
      enabled: source.enabled,
      last_scraped_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (jobs.length === 0) {
    return { saved: 0, skipped: false };
  }

  const rows = jobs.map((job) => ({
    external_id: job.externalId,
    source_id: source.id,
    source: job.source,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary || null,
    description: job.description || null,
    remote_type: job.remoteType,
    tags: job.tags,
    source_url: job.sourceUrl,
    apply_url: job.applyUrl,
    posted_at: job.postedAt || null,
    raw_payload: job.rawPayload || {},
  }));

  const { error } = await supabase
    .from("jobs")
    .upsert(rows, { onConflict: "external_id,source" });

  if (error) {
    throw error;
  }

  return { saved: rows.length, skipped: false };
}

