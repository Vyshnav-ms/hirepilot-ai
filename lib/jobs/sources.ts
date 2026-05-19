import { JobSourceConfig } from "@/lib/jobs/types";

export const jobSources: JobSourceConfig[] = [
  {
    id: "remoteok-remote-dev",
    name: "RemoteOK",
    type: "remoteok-html",
    url: "https://remoteok.com/remote-dev-jobs",
    enabled: true,
  },
  {
    id: "greenhouse-vercel",
    name: "Vercel Careers",
    type: "greenhouse-html",
    url: "https://boards.greenhouse.io/vercel",
    enabled: true,
  },
  {
    id: "lever-linear",
    name: "Linear Careers",
    type: "lever-html",
    url: "https://jobs.lever.co/linear",
    enabled: true,
  },
];

