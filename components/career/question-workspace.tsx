"use client";

import { useMemo, useState } from "react";
import { Bookmark, ChevronDown, Copy, Download, FileArchive, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InterviewQuestion } from "@/lib/career-types";
import { useCareerStore } from "@/lib/career-store";
import { cn } from "@/lib/utils";

const categoryMeta = {
  technical: { label: "Technical", tone: "from-blue-500/20 to-violet-500/20 text-blue-100" },
  hr: { label: "HR", tone: "from-emerald-500/20 to-teal-500/20 text-emerald-100" },
  project: { label: "Projects", tone: "from-orange-500/20 to-amber-500/20 text-orange-100" },
  scenario: { label: "Scenario", tone: "from-violet-500/20 to-cyan-500/20 text-violet-100" },
  behavioral: { label: "Behavioral", tone: "from-pink-500/20 to-fuchsia-500/20 text-pink-100" },
};

function QuestionCard({ item, index, tone }: { item: InterviewQuestion; index: number; tone: string }) {
  const [open, setOpen] = useState(index === 0);
  const { favoriteQuestions, toggleFavoriteQuestion } = useCareerStore();
  const favorite = favoriteQuestions.includes(item.question);

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(`${item.question}\n\n${item.answer}`);
    toast.success("Question copied.");
  };

  return (
    <motion.div layout className={cn("rounded-2xl border border-white/10 bg-gradient-to-br p-4", tone)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0">
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 leading-7 text-zinc-200">{item.answer}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyAnswer}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition hover:bg-white/10"
              >
                <Copy className="size-4" />
                Copy
              </button>
              <button
                type="button"
                onClick={() => toggleFavoriteQuestion(item.question)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-sm text-white transition hover:bg-white/10",
                  favorite && "border-amber-300/30 text-amber-100"
                )}
              >
                <Bookmark className={cn("size-4", favorite && "fill-current")} />
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function QuestionWorkspace({
  technical,
  hr,
  project,
  scenario,
  behavioral,
}: {
  technical: InterviewQuestion[];
  hr: InterviewQuestion[];
  project: InterviewQuestion[];
  scenario: InterviewQuestion[];
  behavioral: InterviewQuestion[];
}) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const groups = useMemo(
    () => ({
      technical,
      hr,
      project,
      scenario,
      behavioral,
    }),
    [technical, hr, project, scenario, behavioral]
  );

  const filterQuestions = (items: InterviewQuestion[]) =>
    items.filter((item) => {
      const matchesQuery = `${item.question} ${item.answer} ${item.difficulty}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesDifficulty = difficulty === "All" || item.difficulty === difficulty;
      return matchesQuery && matchesDifficulty;
    });

  const exportText = (type: "PDF" | "DOCX") => {
    toast.success(`${type} export is queued for this session.`);
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search questions..."
            className="premium-input h-11 w-full rounded-xl pl-10 pr-3"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", "Easy", "Medium", "Hard"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setDifficulty(item)}
              className={cn(
                "rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10",
                difficulty === item && "bg-white text-black"
              )}
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            onClick={() => exportText("PDF")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            <Download className="size-4" />
            PDF
          </button>
          <button
            type="button"
            onClick={() => exportText("DOCX")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10"
          >
            <FileArchive className="size-4" />
            DOCX
          </button>
        </div>
      </div>

      <Tabs defaultValue="technical" className="w-full" onValueChange={() => setPage(1)}>
        <TabsList className="glass-card h-auto flex-wrap bg-white/[0.04] p-1">
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <TabsTrigger key={key} value={key} className="px-4 py-2">
              {meta.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categoryMeta).map(([key, meta]) => {
          const items = filterQuestions(groups[key as keyof typeof groups]);
          const maxPage = Math.max(1, Math.ceil(items.length / perPage));
          const pageItems = items.slice((page - 1) * perPage, page * perPage);

          return (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-2xl font-semibold">{meta.label} Questions</h3>
                <p className="text-sm text-zinc-400">{items.length} results</p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {pageItems.map((item, index) => (
                  <QuestionCard
                    key={`${item.question}-${index}`}
                    item={item}
                    index={(page - 1) * perPage + index}
                    tone={meta.tone}
                  />
                ))}
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40"
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-zinc-400">
                  {page} / {maxPage}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((value) => Math.min(maxPage, value + 1))}
                  className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 disabled:opacity-40"
                  disabled={page === maxPage}
                >
                  Next
                </button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}

