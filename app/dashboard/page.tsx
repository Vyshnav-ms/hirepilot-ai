"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Copy,
  FileText,
  Loader2,
  LogOut,
  Search,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BrandMark } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type InterviewQuestion = {
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
};

type AnalysisResult = {
  technicalQuestions: InterviewQuestion[];
  hrQuestions: InterviewQuestion[];
  projectQuestions: InterviewQuestion[];
  skills: string[];
  missingSkills: string[];
  candidateStrengths: string[];
};

const emptyResult: AnalysisResult = {
  technicalQuestions: [],
  hrQuestions: [],
  projectQuestions: [],
  skills: [],
  missingSkills: [],
  candidateStrengths: [],
};

function QuestionCard({
  item,
  index,
  tone,
}: {
  item: InterviewQuestion;
  index: number;
  tone: "technical" | "hr" | "project";
}) {
  const [open, setOpen] = useState(index === 0);
  const color =
    tone === "technical"
      ? "from-blue-500/20 to-violet-500/20 text-blue-100 border-blue-400/20"
      : tone === "hr"
        ? "from-emerald-500/20 to-teal-500/20 text-emerald-100 border-emerald-400/20"
        : "from-fuchsia-500/20 to-blue-500/20 text-fuchsia-100 border-fuchsia-400/20";

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(`${item.question}\n\n${item.answer}`);
    toast.success("Question copied.");
  };

  return (
    <motion.div layout className={cn("rounded-2xl border bg-gradient-to-br p-4", color)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <div className="mb-3 inline-flex rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/75">
            {item.difficulty || "Medium"}
          </div>
          <h3 className="text-base font-semibold leading-7 text-white">
            {index + 1}. {item.question}
          </h3>
        </div>
        <ChevronDown className={cn("mt-2 size-5 shrink-0 transition", open && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="mt-4 leading-7 text-zinc-200">{item.answer}</p>
            <button
              type="button"
              onClick={copyAnswer}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition hover:bg-white/10"
            >
              <Copy className="size-4" />
              Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SkeletonPanel() {
  return (
    <div className="mt-8 grid gap-4 lg:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="glass-card rounded-2xl p-5">
          <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
          <div className="mt-5 h-5 w-5/6 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-full animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email || "");
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out.");
    router.push("/login");
  };

  const analyzeResume = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      toast.error("Please enter resume and job description.");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI analysis failed");
      }

      setAnalysis({ ...emptyResult, ...data.data });
      toast.success("Interview questions generated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI analysis failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const filterList = (items: InterviewQuestion[]) =>
      items.filter((item) =>
        `${item.question} ${item.answer} ${item.difficulty}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );

    return {
      technical: filterList(analysis?.technicalQuestions || []),
      hr: filterList(analysis?.hrQuestions || []),
      project: filterList(analysis?.projectQuestions || []),
    };
  }, [analysis, query]);

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 px-5 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <BrandMark />
            <div className="min-w-0">
              <p className="text-sm text-zinc-400">Welcome back</p>
              <h1 className="truncate text-base font-semibold sm:text-lg">
                {email || "HirePilot user"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300 md:flex">
              <CheckCircle2 className="size-4 text-emerald-300" />
              Supabase secured
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/[0.08]"
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            AI workspace
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
            Generate structured interview intelligence.
          </h2>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
            Paste your resume and target job description to receive technical,
            HR, project, skill, and strength analysis in clean sections.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="glass-card rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <FileText className="size-5 text-blue-300" />
              <h3 className="text-xl font-semibold">Resume Input</h3>
            </div>
            <textarea
              placeholder="Paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="premium-input min-h-[300px] w-full resize-y rounded-xl p-4 leading-7"
            />
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-3">
              <BriefcaseBusiness className="size-5 text-violet-300" />
              <h3 className="text-xl font-semibold">Job Description Input</h3>
            </div>
            <textarea
              placeholder="Paste the job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="premium-input min-h-[300px] w-full resize-y rounded-xl p-4 leading-7"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={analyzeResume}
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-black shadow-2xl shadow-violet-500/15 transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {loading ? "Generating..." : "Generate Interview Questions"}
          </button>

          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search generated questions..."
              className="premium-input h-12 w-full rounded-xl pl-10 pr-3"
            />
          </div>
        </div>

        {loading && <SkeletonPanel />}

        {!loading && !analysis && (
          <div className="glass-card mt-8 rounded-2xl p-8 text-center">
            <Clipboard className="mx-auto size-10 text-zinc-500" />
            <h3 className="mt-4 text-xl font-semibold">No analysis yet</h3>
            <p className="mt-2 text-zinc-400">
              Add your resume and job description, then generate your AI interview plan.
            </p>
          </div>
        )}

        {analysis && (
          <section className="mt-8">
            <Tabs defaultValue="technical" className="w-full">
              <TabsList className="glass-card h-auto flex-wrap bg-white/[0.04] p-1">
                <TabsTrigger value="technical" className="px-4 py-2">Technical</TabsTrigger>
                <TabsTrigger value="hr" className="px-4 py-2">HR</TabsTrigger>
                <TabsTrigger value="projects" className="px-4 py-2">Projects</TabsTrigger>
                <TabsTrigger value="skills" className="px-4 py-2">Skills</TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="mt-6">
                <h3 className="mb-4 text-2xl font-semibold">Technical Interview Questions</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filtered.technical.map((item, index) => (
                    <QuestionCard key={`${item.question}-${index}`} item={item} index={index} tone="technical" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hr" className="mt-6">
                <h3 className="mb-4 text-2xl font-semibold">HR Interview Questions</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filtered.hr.map((item, index) => (
                    <QuestionCard key={`${item.question}-${index}`} item={item} index={index} tone="hr" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <h3 className="mb-4 text-2xl font-semibold">Project-Based Questions</h3>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filtered.project.map((item, index) => (
                    <QuestionCard key={`${item.question}-${index}`} item={item} index={index} tone="project" />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <div className="grid gap-5 lg:grid-cols-3">
                  {[
                    ["Skills", analysis.skills, "text-blue-200"],
                    ["Missing Skills", analysis.missingSkills, "text-amber-200"],
                    ["Candidate Strengths", analysis.candidateStrengths, "text-emerald-200"],
                  ].map(([title, items, color]) => (
                    <div key={title as string} className="glass-card rounded-2xl p-5">
                      <h3 className="text-xl font-semibold">{title as string}</h3>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {(items as string[]).map((item) => (
                          <span
                            key={item}
                            className={cn("rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-sm", color as string)}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
