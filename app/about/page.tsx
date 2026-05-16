import { Brain, Code2, GraduationCap, Sparkles, UserRound } from "lucide-react";
import { FadeIn, HoverLift, PageTransition } from "@/components/motion-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const stack = ["Next.js 15+ App Router", "TypeScript", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Supabase", "Groq AI"];

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen text-white">
        <SiteNav />
        <main className="mx-auto max-w-7xl px-6 py-20">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
              About HirePilot AI
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
              A premium AI interview preparation platform for modern candidates.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              HirePilot AI helps candidates turn resume and job description context into
              structured technical questions, HR answers, project prompts, skill gaps,
              and strengths that are easy to practice.
            </p>
          </FadeIn>

          <section className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              [Brain, "Mission", "Make high-quality interview preparation accessible, focused, and personalized."],
              [Sparkles, "Features", "Resume analysis, AI-generated questions, skill insights, and polished answer guidance."],
              [Code2, "Technology", "Built with a modern SaaS stack optimized for speed, polish, and reliability."],
            ].map(([Icon, title, text]) => (
              <HoverLift key={title as string}>
                <div className="glass-card h-full rounded-2xl p-6">
                  <Icon className="size-8 text-blue-300" />
                  <h2 className="mt-5 text-2xl font-semibold">{title as string}</h2>
                  <p className="mt-3 leading-7 text-zinc-400">{text as string}</p>
                </div>
              </HoverLift>
            ))}
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <FadeIn>
              <div className="glass-card rounded-3xl p-8">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-300">
                  Developed By
                </p>
                <div className="mt-6 flex items-center gap-5">
                  <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500">
                    <UserRound className="size-9" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold">Vyshnav M S</h2>
                    <p className="mt-2 text-zinc-400">MCA Student</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-3 text-sm text-zinc-300">
                  <p className="flex items-center gap-3">
                    <GraduationCap className="size-4 text-violet-300" />
                    MCA Student
                  </p>
                  <p className="flex items-center gap-3">
                    <Code2 className="size-4 text-blue-300" />
                    Full Stack Developer
                  </p>
                  <p className="flex items-center gap-3">
                    <Sparkles className="size-4 text-emerald-300" />
                    AI Enthusiast
                  </p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <div>
                <h2 className="text-3xl font-semibold">Technology stack</h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {stack.map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-zinc-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
