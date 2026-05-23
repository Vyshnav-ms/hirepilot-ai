import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  MessageSquareText,
  ScanSearch,
  Sparkles,
} from "lucide-react";

export default function DashboardHomePage() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-violet-200 dark:border-white/10 bg-gradient-to-br from-violet-50 via-blue-50 to-transparent dark:from-blue-600/20 dark:via-violet-600/15 dark:to-transparent p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
        <div className="relative max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-white/10 bg-violet-100 dark:bg-white/[0.07] px-4 py-1.5 text-sm text-violet-700 dark:text-blue-200">
            <Sparkles className="size-3.5" />
            Resume + Job Description Matching
          </div>
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-white md:text-4xl lg:text-5xl">
            Prepare smarter.<br />
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-300 dark:to-violet-300 bg-clip-text text-transparent">
              Land interviews faster.
            </span>
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-zinc-600 dark:text-zinc-300">
            Upload your resume and paste a job description. HirePilot AI generates 250 personalized interview questions and measures your ATS compatibility — real AI, not templates.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/dashboard/interview" className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black shadow-lg shadow-violet-500/20 transition hover:scale-[1.03]">
              <MessageSquareText className="size-4" />
              Generate Interview Plan
            </Link>
            <Link href="/dashboard/ats" className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.06] px-5 py-2.5 text-sm font-semibold text-zinc-800 dark:text-white transition hover:bg-black/[0.07] dark:hover:bg-white/[0.1]">
              <ScanSearch className="size-4" />
              Check ATS Score
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <h3 className="mb-5 text-xl font-semibold text-foreground">How it works</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { step: "1", title: "Upload Resume", desc: "Upload your resume PDF or paste the text directly into the editor." },
            { step: "2", title: "Add Job Description", desc: "Paste the job description for the role you are targeting." },
            { step: "3", title: "Get AI Analysis", desc: "Receive 250 personalized questions and your ATS compatibility score." },
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-2xl p-5">
              <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                {item.step}
              </div>
              <h4 className="font-semibold text-foreground">{item.title}</h4>
              <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section>
        <h3 className="mb-5 text-xl font-semibold text-foreground">Tools</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Link href="/dashboard/interview" className="glass-card group flex items-start gap-4 rounded-2xl p-6 transition hover:-translate-y-0.5">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-200">
              <MessageSquareText className="size-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Interview Generator</h4>
              <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Generate 250 questions across 5 categories — Technical, HR, Projects, Behavioral, and Scenario — tailored to your resume and JD.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-300 transition group-hover:gap-2.5">
                Start generating <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>

          <Link href="/dashboard/ats" className="glass-card group flex items-start gap-4 rounded-2xl p-6 transition hover:-translate-y-0.5">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-200">
              <ScanSearch className="size-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">ATS Score Checker</h4>
              <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Compare your resume against a job description. Get your ATS score, keyword gaps, missing skills, and improvement recommendations.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-300 transition group-hover:gap-2.5">
                Check your score <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Generation summary */}
      <section className="glass-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <BrainCircuit className="size-5 text-violet-600 dark:text-violet-300" />
          <h3 className="font-semibold text-foreground">What the AI generates</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-5">
          {[
            { label: "Technical", count: "50", light: "bg-blue-50 text-blue-700 border-blue-200", dark: "dark:bg-blue-500/20 dark:text-blue-200 dark:border-blue-500/20" },
            { label: "HR", count: "50", light: "bg-emerald-50 text-emerald-700 border-emerald-200", dark: "dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-500/20" },
            { label: "Projects", count: "50", light: "bg-orange-50 text-orange-700 border-orange-200", dark: "dark:bg-orange-500/20 dark:text-orange-200 dark:border-orange-500/20" },
            { label: "Behavioral", count: "50", light: "bg-pink-50 text-pink-700 border-pink-200", dark: "dark:bg-pink-500/20 dark:text-pink-200 dark:border-pink-500/20" },
            { label: "Scenario", count: "50", light: "bg-violet-50 text-violet-700 border-violet-200", dark: "dark:bg-violet-500/20 dark:text-violet-200 dark:border-violet-500/20" },
          ].map((item) => (
            <div key={item.label} className={`rounded-xl border p-4 text-center ${item.light} ${item.dark}`}>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="mt-1 text-xs font-medium opacity-80">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          All 250 questions are generated dynamically by analyzing your resume against the job description — no templates, no fake data.
        </p>
      </section>
    </div>
  );
}
