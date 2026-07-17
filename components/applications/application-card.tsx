"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { ApplicationRecord } from "@/lib/application-types";
import { StatusBadge } from "@/components/applications/status-badge";

export function ApplicationCard({ application }: { application: ApplicationRecord }) {
  return (
    <Link href={`/dashboard/applications/${application.id}`} className="glass-card group block rounded-2xl p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
            <BriefcaseBusiness className="size-5" />
          </div>
          <div>
            <h3 className="font-semibold">{application.role || "Untitled role"}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{application.company || "Company not detected"}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>
      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="font-semibold">{application.ats_score ?? 0}% ATS</span>
        <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-300">View <ArrowRight className="size-4 transition group-hover:translate-x-0.5" /></span>
      </div>
    </Link>
  );
}
