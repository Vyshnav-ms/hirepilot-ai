export type ScrapedJob = {
  externalId: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  source: string;
  sourceUrl: string;
  applyUrl: string;
  remoteType: "Remote" | "Hybrid" | "On-site" | "Unknown";
  postedAt?: string;
  tags: string[];
  rawPayload?: Record<string, unknown>;
};

export type JobSourceConfig = {
  id: string;
  name: string;
  type: "remoteok-html" | "greenhouse-html" | "lever-html";
  url: string;
  enabled: boolean;
};

export type IngestionResult = {
  source: string;
  sourceUrl: string;
  recordsFound: number;
  jobs: ScrapedJob[];
  error?: string;
};

