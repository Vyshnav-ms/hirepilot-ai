"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/applications/status-badge";
import { authFetch } from "@/lib/auth-fetch";
import { ApplicationRecord } from "@/lib/application-types";

export default function ApplicationHistoryPage() {
  const [records, setRecords] = useState<ApplicationRecord[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const response = await authFetch("/api/application/history");
    const data = await response.json();
    if (response.ok) setRecords(data.data);
    setLoading(false);
  };

  useEffect(() => {
    startTransition(() => {
      void load();
    });
  }, []);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const haystack = `${record.company ?? ""} ${record.role ?? ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase()) && (status === "All" || record.status === status);
    });
  }, [records, query, status]);

  const postAction = async (url: string, id: string) => {
    const response = await authFetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Action failed.");
    await load();
  };

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Application Tracker</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Track every application.</h2>
        </div>
        <Button asChild size="lg"><Link href="/dashboard/applications/new"><Plus className="size-4" /> New Application</Link></Button>
      </section>

      <section className="glass-card rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="premium-input flex h-11 flex-1 items-center gap-2 px-3">
            <Search className="size-4 text-zinc-400" />
            <input className="w-full bg-transparent text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or role" />
          </label>
          <select className="premium-input h-11 px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
            {["All", "Draft", "Applied", "Interview", "Offer", "Rejected", "Archived"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="glass-card overflow-hidden rounded-2xl">
        {loading ? (
          <div className="flex min-h-[260px] items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-semibold">No applications yet</p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Create your first application to start tracking.</p>
            <Button asChild className="mt-4"><Link href="/dashboard/applications/new">Create First Application</Link></Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-white/10">
                <tr>
                  {["Company", "Role", "Applied Date", "ATS Score", "Status", "Email Sent", "Resume Used", "Actions"].map((head) => <th key={head} className="px-4 py-3 font-semibold">{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id} className="border-b border-zinc-100 last:border-0 dark:border-white/10">
                    <td className="px-4 py-4 font-medium">{record.company || "Unknown"}</td>
                    <td className="px-4 py-4">{record.role || "Untitled"}</td>
                    <td className="px-4 py-4">{new Date(record.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">{record.ats_score ?? 0}%</td>
                    <td className="px-4 py-4"><StatusBadge status={record.status} /></td>
                    <td className="px-4 py-4">{record.status === "Applied" ? "Yes" : "No"}</td>
                    <td className="px-4 py-4">{record.resume_url ? "Master" : "None"}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm"><Link href={`/dashboard/applications/${record.id}`}>View</Link></Button>
                        <Button variant="outline" size="icon-sm" aria-label="Duplicate" onClick={() => postAction("/api/application/duplicate", record.id).then(() => toast.success("Application duplicated."))}><Copy className="size-4" /></Button>
                        <Button variant="destructive" size="icon-sm" aria-label="Delete" onClick={() => postAction("/api/application/delete", record.id).then(() => toast.success("Application deleted."))}><Trash2 className="size-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
