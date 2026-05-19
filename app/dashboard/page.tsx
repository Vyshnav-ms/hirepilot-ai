"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  FileSearch,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/career/metric-card";
import { AtsReport } from "@/components/career/ats-report";
import { JobCards } from "@/components/career/job-cards";
import { sampleAtsAnalysis, sampleJobs } from "@/lib/career-data";

const quickActions = [
  { href: "/dashboard/interview", label: "Generate Interview Plan", icon: MessageSquareText },
  { href: "/dashboard/ats", label: "Check ATS Score", icon: ScanSearch },
  { href: "/dashboard/jobs", label: "Find Matching Jobs", icon: BriefcaseBusiness },
  { href: "/dashboard/resume", label: "Improve Resume", icon: FileSearch },
];

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.18),rgba(168,85,247,0.14),rgba(20,184,166,0.08))] p-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm text-blue-100">
            <Sparkles className="size-4" />
            AI Career Dashboard
          </div>
          <h2 className="text-3xl font-semibold md:text-5xl">
            Build a sharper resume, stronger interviews, and smarter job pipeline.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
            Generate deep interview sets, measure ATS fit, discover gaps, and convert resume context into role-ready preparation.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={MessageSquareText} label="Interview Questions" value="200+" helper="Across technical, HR, project, scenario, and behavioral rounds" tone="purple" />
        <MetricCard icon={ScanSearch} label="ATS Score" value="82%" helper="Latest resume-job fit estimate" tone="blue" />
        <MetricCard icon={BadgeCheck} label="Resume Strength" value="Strong" helper="Profile signal is ready for targeted refinement" tone="green" />
        <MetricCard icon={TrendingUp} label="Job Matches" value="24" helper="AI-ranked opportunities by skill fit" tone="orange" />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-2xl font-semibold">Quick Actions</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => (
            <Link key={item.href} href={item.href} className="glass-card group rounded-2xl p-5 transition hover:-translate-y-1 hover:bg-white/[0.07]">
              <item.icon className="size-7 text-blue-200" />
              <p className="mt-5 font-semibold">{item.label}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-400 group-hover:text-white">
                Open <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">ATS Overview</h3>
          </div>
          <AtsReport analysis={sampleAtsAnalysis} />
        </div>
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-semibold">Recommended Jobs</h3>
            <Link href="/dashboard/jobs" className="text-sm text-blue-200 hover:text-white">
              View all
            </Link>
          </div>
          <JobCards jobs={sampleJobs.slice(0, 2)} />
        </div>
      </section>
    </div>
  );
}
