import { Lock, Mail, ServerCog, ShieldCheck, UserCheck } from "lucide-react";
import { FadeIn, PageTransition } from "@/components/motion-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

const sections = [
  {
    icon: ServerCog,
    title: "Data Collection",
    text: "HirePilot AI uses the resume text, job description, and account email you provide to generate interview preparation insights.",
  },
  {
    icon: ShieldCheck,
    title: "Resume Privacy Assurance",
    text: "Your resume content is used for the requested analysis experience and should be treated as private candidate data.",
  },
  {
    icon: Lock,
    title: "AI Processing",
    text: "Resume and job description content may be sent to the configured AI provider to generate structured questions, answers, and skill analysis.",
  },
  {
    icon: UserCheck,
    title: "Authentication Security",
    text: "Supabase Authentication manages secure sign-up, login, and email verification for user accounts.",
  },
  {
    icon: Mail,
    title: "User Rights and Contact",
    text: "Users can request account support, data clarification, or privacy-related help through the project contact channel.",
  },
];

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="min-h-screen text-white">
        <SiteNav />
        <main className="mx-auto max-w-5xl px-6 py-20">
          <FadeIn>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
              Privacy Policy
            </p>
            <h1 className="mt-4 text-4xl font-semibold md:text-6xl">
              Clear, respectful handling of candidate data.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              This policy explains how HirePilot AI handles resume, job
              description, authentication, and AI processing data.
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-5">
            {sections.map((section, index) => (
              <FadeIn key={section.title} delay={index * 0.04}>
                <article className="glass-card rounded-2xl p-6">
                  <section.icon className="size-7 text-violet-300" />
                  <h2 className="mt-4 text-2xl font-semibold">{section.title}</h2>
                  <p className="mt-3 leading-7 text-zinc-400">{section.text}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
