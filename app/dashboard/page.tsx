"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  FileArchive,
  Loader2,
  MessageSquareText,
  Plus,
  ScanSearch,
} from "lucide-react";
import { StatusBadge } from "@/components/applications/status-badge";
import { Button } from "@/components/ui/button";
import { AnalyticsSummary, ApplicationRecord } from "@/lib/application-types";
import { authFetch } from "@/lib/auth-fetch";

type DashboardState = {
  analytics: AnalyticsSummary | null;
  latest: ApplicationRecord[];
};

export default function DashboardHomePage() {
  const [state, setState] = useState<DashboardState>({ analytics: null, latest: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [analyticsResponse, historyResponse] = await Promise.all([
          authFetch("/api/analytics"),
          authFetch("/api/application/history"),
        ]);
        const analyticsBody = await analyticsResponse.json();
        const historyBody = await historyResponse.json();

        if (!active) return;
        setState({
          analytics: analyticsResponse.ok ? analyticsBody.data : null,
          latest: historyResponse.ok ? (historyBody.data as ApplicationRecord[]).slice(0, 5) : [],
        });
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const metrics = [
    ["Applications Today", state.analytics?.applicationsToday ?? 0],
    ["Applications This Month", state.analytics?.applicationsThisMonth ?? 0],
    ["Average ATS", `${state.analytics?.averageAts ?? 0}%`],
    ["Resume Completion", `${state.analytics?.resumeCompletion ?? 0}%`],
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="glass-card rounded-2xl p-7 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            AI Job Application Assistant
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
            Match smarter, apply faster, track every role.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Use your saved master resume to analyze job descriptions, find ATS gaps, generate HR-ready emails, and keep your application pipeline organized.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard/applications/new">
                <Plus className="size-4" />
                New Application
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard/resume-vault">
                <FileArchive className="size-4" />
                Upload Resume
              </Link>
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 grid gap-3">
            {[
              ["/dashboard/resume-vault", "Upload Resume", FileArchive],
              ["/dashboard/applications/new", "New Application", BriefcaseBusiness],
              ["/dashboard/mock-interview", "Mock Interview", MessageSquareText],
              ["/dashboard/resume-analyzer", "Resume Analyzer", ScanSearch],
            ].map(([href, label, Icon]) => (
              <Link
                key={href as string}
                href={href as string}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white/60 px-4 py-3 text-sm font-semibold transition hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.07]"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4 text-blue-500" />
                  {label as string}
                </span>
                <ArrowRight className="size-4 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map(([label, value]) => (
          <div key={label as string} className="glass-card rounded-2xl p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{label as string}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="glass-card rounded-2xl p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="font-semibold">Latest Applications</h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/applications/history">View Tracker</Link>
            </Button>
          </div>
          {loading ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : state.latest.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-white/15">
              <p className="font-semibold">No applications yet</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Create your first application to start tracking.</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/applications/new">Create First Application</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.latest.map((record) => (
                <Link
                  key={record.id}
                  href={`/dashboard/applications/${record.id}`}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white/60 p-4 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{record.company || "Unknown company"}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{record.role || "Untitled role"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{record.ats_score ?? 0}% ATS</span>
                    <StatusBadge status={record.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="size-5 text-blue-500" />
            <h3 className="font-semibold">Pipeline Snapshot</h3>
          </div>
          <div className="space-y-3">
            {(state.analytics?.statusBreakdown ?? []).length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Application status data will appear here.</p>
            ) : (
              state.analytics?.statusBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(100, item.count * 20)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
