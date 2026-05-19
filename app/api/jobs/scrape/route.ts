import { NextRequest, NextResponse } from "next/server";
import { jobSources } from "@/lib/jobs/sources";
import { scrapeConfiguredSources } from "@/lib/jobs/scrapers";
import { persistScrapedJobs } from "@/lib/jobs/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const selectedSources =
      Array.isArray(body.sources) && body.sources.length > 0
        ? jobSources.filter((source) => body.sources.includes(source.id))
        : jobSources;

    const { results, jobs } = await scrapeConfiguredSources(selectedSources);
    const persistence = await Promise.all(
      selectedSources.map((source) =>
        persistScrapedJobs({
          source,
          jobs: jobs.filter((job) => job.source === source.name),
        }).catch((error) => ({
          saved: 0,
          skipped: true,
          error: error instanceof Error ? error.message : "Persistence failed",
        }))
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        jobs,
        results,
        persistence,
        recordsFound: jobs.length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Job scraping failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
