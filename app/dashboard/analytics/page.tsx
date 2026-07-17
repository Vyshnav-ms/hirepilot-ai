"use client";

import { useEffect, useState } from "react";
import { BarChart3, Loader2 } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { AnalyticsSummary } from "@/lib/application-types";

function Bars({ items }: { items: Array<{ label: string; count: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  return (
    <div className="space-y-3">
      {items.length === 0 ? <p className="text-sm text-zinc-500">No data yet.</p> : items.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-sm"><span>{item.label}</span><span>{item.count}</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"><div className="h-full rounded-full bg-blue-500" style={{ width: `${(item.count / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    authFetch("/api/analytics").then((response) => response.json()).then((body) => setData(body.data));
  }, []);

  if (!data) return <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>;

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Analytics</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Application performance.</h2>
      </section>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Applications Today", data.applicationsToday],
          ["Applications This Month", data.applicationsThisMonth],
          ["Average ATS", `${data.averageAts}%`],
          ["Resume Completion", `${data.resumeCompletion}%`],
        ].map(([label, value]) => (
          <div key={label as string} className="glass-card rounded-2xl p-5">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{label as string}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        {[
          ["Applications Per Month", data.applicationsPerMonth],
          ["Most Applied Skills", data.mostAppliedSkills],
          ["Most Common Missing Skills", data.mostCommonMissingSkills],
          ["Application Status", data.statusBreakdown],
        ].map(([title, items]) => (
          <div key={title as string} className="glass-card rounded-2xl p-5">
            <div className="mb-5 flex items-center gap-2"><BarChart3 className="size-5 text-blue-500" /><h3 className="font-semibold">{title as string}</h3></div>
            <Bars items={items as Array<{ label: string; count: number }>} />
          </div>
        ))}
      </section>
    </div>
  );
}
