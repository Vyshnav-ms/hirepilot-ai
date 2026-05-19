import * as cheerio from "cheerio";
import { cleanText, dedupeJobs, detectRemoteType, makeJobId } from "@/lib/jobs/normalize";
import { IngestionResult, JobSourceConfig, ScrapedJob } from "@/lib/jobs/types";

const headers = {
  "user-agent":
    "HirePilotAIJobResearchBot/1.0 (+https://github.com/Vyshnav-ms/hirepilot-ai)",
  accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
};

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers,
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed with ${response.status}`);
  }

  return response.text();
}

function absoluteUrl(url: string, baseUrl: string) {
  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}

async function scrapeRemoteOk(source: JobSourceConfig): Promise<IngestionResult> {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const jobs: ScrapedJob[] = [];

  $("tr.job").each((_, element) => {
    const row = $(element);
    const title = cleanText(row.find("h2, .company h2, [itemprop='title']").first().text());
    const company = cleanText(row.find("h3, .company h3, [itemprop='hiringOrganization']").first().text());
    const location = cleanText(row.find(".location, [itemprop='jobLocation']").first().text()) || "Remote";
    const applyPath = row.attr("data-url") || row.find("a.preventLink, a").first().attr("href") || source.url;
    const applyUrl = absoluteUrl(applyPath, "https://remoteok.com");
    const tags = row
      .find(".tag, .tags h3")
      .map((_, tag) => cleanText($(tag).text()))
      .get()
      .filter(Boolean);

    if (!title || !company) {
      return;
    }

    jobs.push({
      externalId: row.attr("data-id") || makeJobId([title, company, location, applyUrl]),
      title,
      company,
      location,
      source: source.name,
      sourceUrl: source.url,
      applyUrl,
      remoteType: "Remote",
      tags,
    });
  });

  return {
    source: source.name,
    sourceUrl: source.url,
    recordsFound: jobs.length,
    jobs: dedupeJobs(jobs),
  };
}

async function scrapeGreenhouse(source: JobSourceConfig): Promise<IngestionResult> {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const jobs: ScrapedJob[] = [];

  $(".opening, .job, [data-mapped='true']").each((_, element) => {
    const card = $(element);
    const link = card.find("a").first();
    const title = cleanText(link.text() || card.find("h3, h4").first().text());
    const location = cleanText(card.find(".location, .opening-location").first().text()) || "Unknown";
    const applyUrl = absoluteUrl(link.attr("href") || source.url, source.url);

    if (!title || !applyUrl) {
      return;
    }

    jobs.push({
      externalId: makeJobId([title, source.name, location, applyUrl]),
      title,
      company: source.name.replace(" Careers", ""),
      location,
      source: source.name,
      sourceUrl: source.url,
      applyUrl,
      remoteType: detectRemoteType(location),
      tags: [],
    });
  });

  return {
    source: source.name,
    sourceUrl: source.url,
    recordsFound: jobs.length,
    jobs: dedupeJobs(jobs),
  };
}

async function scrapeLever(source: JobSourceConfig): Promise<IngestionResult> {
  const html = await fetchHtml(source.url);
  const $ = cheerio.load(html);
  const jobs: ScrapedJob[] = [];

  $(".posting, .posting-title").each((_, element) => {
    const card = $(element);
    const link = card.is("a") ? card : card.find("a").first();
    const title = cleanText(card.find(".posting-title h5, h5, .posting-name").first().text() || link.text());
    const location = cleanText(card.find(".posting-categories, .sort-by-location").first().text()) || "Unknown";
    const applyUrl = absoluteUrl(link.attr("href") || source.url, source.url);

    if (!title || !applyUrl) {
      return;
    }

    jobs.push({
      externalId: makeJobId([title, source.name, location, applyUrl]),
      title,
      company: source.name.replace(" Careers", ""),
      location,
      source: source.name,
      sourceUrl: source.url,
      applyUrl,
      remoteType: detectRemoteType(location),
      tags: [],
    });
  });

  return {
    source: source.name,
    sourceUrl: source.url,
    recordsFound: jobs.length,
    jobs: dedupeJobs(jobs),
  };
}

export async function scrapeJobSource(source: JobSourceConfig): Promise<IngestionResult> {
  try {
    if (source.type === "remoteok-html") {
      return scrapeRemoteOk(source);
    }

    if (source.type === "greenhouse-html") {
      return scrapeGreenhouse(source);
    }

    return scrapeLever(source);
  } catch (error) {
    return {
      source: source.name,
      sourceUrl: source.url,
      recordsFound: 0,
      jobs: [],
      error: error instanceof Error ? error.message : "Scraping failed",
    };
  }
}

export async function scrapeConfiguredSources(sources: JobSourceConfig[]) {
  const enabled = sources.filter((source) => source.enabled);
  const results = await Promise.all(enabled.map((source) => scrapeJobSource(source)));
  const jobs = dedupeJobs(results.flatMap((result) => result.jobs));

  return { results, jobs };
}

