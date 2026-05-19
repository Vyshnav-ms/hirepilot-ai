import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  FileSearch,
  MessageSquareText,
  ScanSearch,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { FadeIn, HoverLift, PageTransition } from "@/components/motion-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const features = [
  {
    icon: BrainCircuit,
    title: "Technical Interview Questions",
    description: "Generate role-specific technical questions with concise, candidate-aware answers.",
  },
  {
    icon: MessageSquareText,
    title: "HR Interview Preparation",
    description: "Practice behavioral questions with polished answers mapped to your profile.",
  },
  {
    icon: ScanSearch,
    title: "AI Skill Gap Analysis",
    description: "Spot missing skills and focus your preparation on what hiring teams expect.",
  },
  {
    icon: FileSearch,
    title: "ATS + Resume Analysis",
    description: "Measure keyword fit, missing skills, section completeness, and resume strength.",
  },
  {
    icon: WandSparkles,
    title: "Personalized Answers",
    description: "Receive answers that reflect your experience instead of generic templates.",
  },
  {
    icon: BriefcaseBusiness,
    title: "AI Job Recommendations",
    description: "Find job matches across major platforms with role, salary, location, and fit insights.",
  },
];

const steps = [
  "Upload resume PDF",
  "Add target role context",
  "Generate interview, ATS, and job intelligence",
];

const stats = ["200+ AI questions", "5 ATS score pillars", "8 job source categories", "Secure Supabase auth"];

const faqs = [
  ["Can I paste resume text manually?", "Yes. If PDF extraction fails or the resume is scanned, the dashboard shows a clean fallback text area."],
  ["Does it support ATS optimization?", "Yes. The platform checks skills, experience, education, keywords, formatting, and section completeness."],
  ["Are job recommendations live scraped?", "The app is designed for AI recommendations and source links. Direct third-party integrations can be added with official APIs."],
];

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden text-white">
        <SiteNav />

        <main>
          <section className="relative mx-auto flex min-h-[calc(100vh-74px)] max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
            <FadeIn>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-zinc-300 shadow-2xl shadow-violet-950/30 backdrop-blur">
                <Sparkles className="size-4 text-violet-300" />
                AI Career Assistant Platform
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
                HirePilot AI
              </h1>
            </FadeIn>

            <FadeIn delay={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                A premium AI SaaS workspace for interview preparation, ATS optimization,
                resume improvement, and skill-based job discovery.
              </p>
            </FadeIn>

            <FadeIn delay={0.24}>
              <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black shadow-2xl shadow-violet-500/20 transition hover:scale-105 hover:shadow-violet-400/30"
                >
                  Get Started <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Login
                </Link>
              </div>
            </FadeIn>

            <div className="pointer-events-none absolute left-6 top-32 hidden rounded-xl border border-blue-400/20 bg-blue-400/10 px-4 py-3 text-sm text-blue-100 shadow-xl shadow-blue-500/10 backdrop-blur lg:block">
              ATS readiness +32%
            </div>
            <div className="pointer-events-none absolute bottom-32 right-8 hidden rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-3 text-sm text-violet-100 shadow-xl shadow-violet-500/10 backdrop-blur lg:block">
              200 tailored questions ready
            </div>

            <FadeIn delay={0.32}>
              <div className="mt-12 w-full max-w-5xl rounded-2xl border border-white/10 bg-black/50 p-4 text-left shadow-2xl shadow-black/40">
                <div className="grid gap-3 md:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat} className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                      <p className="text-sm text-zinc-400">{stat}</p>
                      <div className="mt-4 h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" />
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>

          <section className="mx-auto max-w-7xl px-6 pb-20 pt-4">
            <FadeIn>
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
                  Features
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
                  Everything your interview prep needs, structured beautifully.
                </h2>
              </div>
            </FadeIn>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <FadeIn key={feature.title} delay={index * 0.04}>
                  <HoverLift>
                    <div className="glass-card h-full rounded-2xl p-6">
                      <feature.icon className="size-8 text-violet-300" />
                      <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
                      <p className="mt-3 leading-7 text-zinc-400">{feature.description}</p>
                    </div>
                  </HoverLift>
                </FadeIn>
              ))}
            </div>
          </section>

          <section className="border-y border-white/10 bg-white/[0.025] px-6 py-20">
            <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <FadeIn>
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
                    How it works
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
                    From raw resume to polished interview plan.
                  </h2>
                </div>
              </FadeIn>
              <div className="grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <FadeIn key={step} delay={index * 0.08}>
                    <div className="glass-card rounded-2xl p-6">
                      <span className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 font-semibold">
                        {index + 1}
                      </span>
                      <p className="mt-5 font-medium">{step}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-6 py-20">
            <FadeIn>
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
                  Pricing
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
                  Portfolio-ready SaaS packaging.
                </h2>
              </div>
            </FadeIn>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {["Starter", "Pro", "Career Studio"].map((plan, index) => (
                <HoverLift key={plan}>
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-2xl font-semibold">{plan}</h3>
                    <p className="mt-4 text-4xl font-semibold">{index === 0 ? "Free" : index === 1 ? "$9" : "$19"}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      Interview generation, ATS analysis, resume insights, and AI job matching workflows.
                    </p>
                  </div>
                </HoverLift>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-5xl px-6 pb-20">
            <FadeIn>
              <h2 className="text-3xl font-semibold md:text-5xl">FAQ</h2>
            </FadeIn>
            <div className="mt-8 grid gap-4">
              {faqs.map(([question, answer]) => (
                <div key={question} className="glass-card rounded-2xl p-6">
                  <h3 className="text-xl font-semibold">{question}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto grid max-w-7xl gap-5 px-6 py-20 md:grid-cols-3">
            {["Clear preparation roadmap", "Confidence for technical rounds", "Answers shaped around your story"].map((benefit) => (
              <HoverLift key={benefit}>
                <div className="glass-card rounded-2xl p-6">
                  <BadgeCheck className="size-7 text-emerald-300" />
                  <h3 className="mt-4 text-xl font-semibold">{benefit}</h3>
                  <p className="mt-3 text-zinc-400">
                    Premium guidance with clean structure, readable insights, and practical next steps.
                  </p>
                </div>
              </HoverLift>
            ))}
          </section>

          <section className="px-6 pb-24">
            <div className="glass-card mx-auto max-w-5xl rounded-3xl p-8 text-center md:p-12">
              <h2 className="text-3xl font-semibold md:text-5xl">
                Build your interview advantage today.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                Generate tailored technical, HR, and project questions in a polished dashboard built for serious preparation.
              </p>
              <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Open Dashboard <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </PageTransition>
  );
}
