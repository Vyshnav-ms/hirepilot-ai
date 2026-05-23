"use client";

import { useMemo, useState } from "react";
import { Bookmark, ChevronDown, Copy, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BehavioralQuestion,
  Difficulty,
  HrQuestion,
  InterviewResult,
  ProjectQuestion,
  ScenarioQuestion,
  TechnicalQuestion,
} from "@/lib/career-types";
import { useCareerStore } from "@/lib/career-store";
import { cn } from "@/lib/utils";

/* ─── Helpers ─────────────────────────────────────────────────────── */

const difficultyColor: Record<Difficulty | string, string> = {
  Easy: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Hard: "bg-red-500/15 text-red-300 border-red-500/20",
};

const PER_PAGE = 10;

function usePagination<T>(items: T[], query: string, filterFn: (item: T, q: string) => boolean) {
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    setPage(1);
    return items.filter((item) => filterFn(item, query));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, query]);
  const maxPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return { filtered, pageItems, page, setPage, maxPage };
}

function Pager({ page, maxPage, onPrev, onNext }: { page: number; maxPage: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={page === 1}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.07] disabled:opacity-30"
      >
        Previous
      </button>
      <span className="min-w-[80px] text-center text-sm text-zinc-400">
        {page} / {maxPage}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={page === maxPage}
        className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.07] disabled:opacity-30"
      >
        Next
      </button>
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative mb-5">
      <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Search questions..."}
        className="premium-input h-11 w-full rounded-xl pl-10 pr-4 text-sm"
      />
    </div>
  );
}

/* ─── Technical Card ──────────────────────────────────────────────── */
function TechCard({ item, index }: { item: TechnicalQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  const { favoriteQuestions, toggleFavoriteQuestion } = useCareerStore();
  const fav = favoriteQuestions.includes(item.question);

  return (
    <motion.div layout className={cn(
      "rounded-2xl border border-white/10 bg-gradient-to-br p-5 from-blue-500/10 to-violet-500/10"
    )}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {item.difficulty && (
              <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-medium", difficultyColor[item.difficulty] ?? difficultyColor.Medium)}>
                {item.difficulty}
              </span>
            )}
            {item.topic && (
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 text-xs text-zinc-400">
                {item.topic}
              </span>
            )}
            {item.skill && (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs text-blue-300">
                {item.skill}
              </span>
            )}
          </div>
          <h4 className="text-sm font-semibold leading-6 text-white">
            {index + 1}. {item.question}
          </h4>
        </div>
        <ChevronDown className={cn("mt-1 size-5 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.answer}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Q: ${item.question}\n\nA: ${item.answer}`); toast.success("Copied!"); }} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]">
                <Copy className="size-3" /> Copy
              </button>
              <button type="button" onClick={() => toggleFavoriteQuestion(item.question)} className={cn("inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs transition hover:bg-white/[0.08]", fav ? "text-amber-300" : "text-zinc-300")}>
                <Bookmark className={cn("size-3", fav && "fill-current")} /> {fav ? "Saved" : "Save"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── HR Card ─────────────────────────────────────────────────────── */
function HrCard({ item, index }: { item: HrQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <h4 className="text-sm font-semibold leading-6 text-white">{index + 1}. {item.question}</h4>
        <ChevronDown className={cn("mt-0.5 size-5 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            {item.purpose && (
              <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                <span className="font-semibold">Purpose:</span> {item.purpose}
              </p>
            )}
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.answer}</p>
            <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Q: ${item.question}\n\nA: ${item.answer}`); toast.success("Copied!"); }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]">
              <Copy className="size-3" /> Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Project Card ────────────────────────────────────────────────── */
function ProjectCard({ item, index }: { item: ProjectQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-gradient-to-br from-orange-500/10 to-amber-500/10 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <div className="min-w-0 flex-1">
          {item.difficulty && (
            <span className={cn("mb-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium", difficultyColor[item.difficulty] ?? difficultyColor.Medium)}>
              {item.difficulty}
            </span>
          )}
          <h4 className="text-sm font-semibold leading-6 text-white">{index + 1}. {item.question}</h4>
        </div>
        <ChevronDown className={cn("mt-1 size-5 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.answer}</p>
            <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Q: ${item.question}\n\nA: ${item.answer}`); toast.success("Copied!"); }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]">
              <Copy className="size-3" /> Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Behavioral Card ─────────────────────────────────────────────── */
function BehavioralCard({ item, index }: { item: BehavioralQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-rose-500/10 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <h4 className="text-sm font-semibold leading-6 text-white">{index + 1}. {item.question}</h4>
        <ChevronDown className={cn("mt-0.5 size-5 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.suggestedAnswer}</p>
            <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Q: ${item.question}\n\nSuggested Answer: ${item.suggestedAnswer}`); toast.success("Copied!"); }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]">
              <Copy className="size-3" /> Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Scenario Card ───────────────────────────────────────────────── */
function ScenarioCard({ item, index }: { item: ScenarioQuestion; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div layout className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-5">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-start justify-between gap-4 text-left">
        <h4 className="text-sm font-semibold leading-6 text-white">{index + 1}. {item.question}</h4>
        <ChevronDown className={cn("mt-0.5 size-5 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <p className="mt-3 text-sm leading-7 text-zinc-300">{item.suggestedSolution}</p>
            <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Scenario: ${item.question}\n\nSolution: ${item.suggestedSolution}`); toast.success("Copied!"); }} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/[0.08]">
              <Copy className="size-3" /> Copy
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Workspace ──────────────────────────────────────────────── */
export function QuestionWorkspace({ result }: { result: InterviewResult }) {
  const [techQuery, setTechQuery] = useState("");
  const [hrQuery, setHrQuery] = useState("");
  const [projQuery, setProjQuery] = useState("");
  const [behavQuery, setBehavQuery] = useState("");
  const [scenQuery, setScenQuery] = useState("");
  const [diffFilter, setDiffFilter] = useState("All");

  const techPaged = usePagination(
    result.technicalQuestions,
    techQuery + diffFilter,
    (item, _) => {
      const q = techQuery.toLowerCase();
      const matchQ = item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        (item.skill ?? "").toLowerCase().includes(q) ||
        (item.topic ?? "").toLowerCase().includes(q);
      const matchD = diffFilter === "All" || item.difficulty === diffFilter;
      return matchQ && matchD;
    }
  );

  const hrPaged = usePagination(result.hrQuestions, hrQuery, (item, q) =>
    item.question.toLowerCase().includes(q.toLowerCase()) ||
    item.answer.toLowerCase().includes(q.toLowerCase())
  );

  const projPaged = usePagination(
    result.projectQuestions,
    projQuery + diffFilter,
    (item, _) => {
      const q = projQuery.toLowerCase();
      const matchQ = item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      const matchD = diffFilter === "All" || item.difficulty === diffFilter;
      return matchQ && matchD;
    }
  );

  const behavPaged = usePagination(result.behavioralQuestions, behavQuery, (item, q) =>
    item.question.toLowerCase().includes(q.toLowerCase()) ||
    item.suggestedAnswer.toLowerCase().includes(q.toLowerCase())
  );

  const scenPaged = usePagination(result.scenarioQuestions, scenQuery, (item, q) =>
    item.question.toLowerCase().includes(q.toLowerCase()) ||
    item.suggestedSolution.toLowerCase().includes(q.toLowerCase())
  );

  const tabs = [
    {
      value: "technical",
      label: "Technical",
      count: result.technicalQuestions.length,
      color: "text-blue-300",
    },
    { value: "hr", label: "HR", count: result.hrQuestions.length, color: "text-emerald-300" },
    {
      value: "projects",
      label: "Projects",
      count: result.projectQuestions.length,
      color: "text-orange-300",
    },
    {
      value: "behavioral",
      label: "Behavioral",
      count: result.behavioralQuestions.length,
      color: "text-pink-300",
    },
    {
      value: "scenario",
      label: "Scenario",
      count: result.scenarioQuestions.length,
      color: "text-violet-300",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm font-semibold text-white">Filter by difficulty:</p>
        {["All", "Easy", "Medium", "Hard"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDiffFilter(d)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
              diffFilter === d
                ? "border-white/20 bg-white text-black"
                : "border-white/10 text-zinc-400 hover:bg-white/[0.07] hover:text-white"
            )}
          >
            {d}
          </button>
        ))}
      </div>

      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="glass-card mb-2 h-auto flex-wrap gap-1 bg-white/[0.03] p-1.5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 px-4 py-2 text-sm">
              {tab.label}
              <span className={cn("rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold", tab.color)}>
                {tab.count}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Technical */}
        <TabsContent value="technical" className="mt-4">
          <SearchBar value={techQuery} onChange={setTechQuery} placeholder="Search by question, skill, or topic..." />
          <p className="mb-3 text-xs text-zinc-500">{techPaged.filtered.length} results</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {techPaged.pageItems.map((item, i) => (
              <TechCard key={item.question + i} item={item} index={(techPaged.page - 1) * PER_PAGE + i} />
            ))}
          </div>
          <Pager page={techPaged.page} maxPage={techPaged.maxPage} onPrev={() => techPaged.setPage((p) => p - 1)} onNext={() => techPaged.setPage((p) => p + 1)} />
        </TabsContent>

        {/* HR */}
        <TabsContent value="hr" className="mt-4">
          <SearchBar value={hrQuery} onChange={setHrQuery} />
          <p className="mb-3 text-xs text-zinc-500">{hrPaged.filtered.length} results</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {hrPaged.pageItems.map((item, i) => (
              <HrCard key={item.question + i} item={item} index={(hrPaged.page - 1) * PER_PAGE + i} />
            ))}
          </div>
          <Pager page={hrPaged.page} maxPage={hrPaged.maxPage} onPrev={() => hrPaged.setPage((p) => p - 1)} onNext={() => hrPaged.setPage((p) => p + 1)} />
        </TabsContent>

        {/* Projects */}
        <TabsContent value="projects" className="mt-4">
          <SearchBar value={projQuery} onChange={setProjQuery} placeholder="Search by project or technology..." />
          <p className="mb-3 text-xs text-zinc-500">{projPaged.filtered.length} results</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {projPaged.pageItems.map((item, i) => (
              <ProjectCard key={item.question + i} item={item} index={(projPaged.page - 1) * PER_PAGE + i} />
            ))}
          </div>
          <Pager page={projPaged.page} maxPage={projPaged.maxPage} onPrev={() => projPaged.setPage((p) => p - 1)} onNext={() => projPaged.setPage((p) => p + 1)} />
        </TabsContent>

        {/* Behavioral */}
        <TabsContent value="behavioral" className="mt-4">
          <SearchBar value={behavQuery} onChange={setBehavQuery} />
          <p className="mb-3 text-xs text-zinc-500">{behavPaged.filtered.length} results</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {behavPaged.pageItems.map((item, i) => (
              <BehavioralCard key={item.question + i} item={item} index={(behavPaged.page - 1) * PER_PAGE + i} />
            ))}
          </div>
          <Pager page={behavPaged.page} maxPage={behavPaged.maxPage} onPrev={() => behavPaged.setPage((p) => p - 1)} onNext={() => behavPaged.setPage((p) => p + 1)} />
        </TabsContent>

        {/* Scenario */}
        <TabsContent value="scenario" className="mt-4">
          <SearchBar value={scenQuery} onChange={setScenQuery} />
          <p className="mb-3 text-xs text-zinc-500">{scenPaged.filtered.length} results</p>
          <div className="grid gap-3 lg:grid-cols-2">
            {scenPaged.pageItems.map((item, i) => (
              <ScenarioCard key={item.question + i} item={item} index={(scenPaged.page - 1) * PER_PAGE + i} />
            ))}
          </div>
          <Pager page={scenPaged.page} maxPage={scenPaged.maxPage} onPrev={() => scenPaged.setPage((p) => p - 1)} onNext={() => scenPaged.setPage((p) => p + 1)} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
