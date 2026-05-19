import { Clock3, FileText, ScanSearch, Search } from "lucide-react";

const historyItems = [
  { type: "Interview", title: "Frontend Engineer interview plan", date: "May 19, 2026", score: "200 questions" },
  { type: "ATS", title: "React Developer ATS report", date: "May 18, 2026", score: "82%" },
  { type: "Jobs", title: "AI job recommendations", date: "May 17, 2026", score: "24 matches" },
  { type: "Resume", title: "Resume improvement audit", date: "May 16, 2026", score: "8 suggestions" },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          History
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Track every AI career workflow.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Supabase-backed history is designed for interview sessions, ATS reports, resume uploads, and job recommendations.
        </p>
      </section>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <input placeholder="Search history..." className="premium-input h-12 w-full rounded-xl pl-10 pr-3" />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        {historyItems.map((item) => (
          <article key={item.title} className="glass-card rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-white/[0.06]">
                  {item.type === "ATS" ? <ScanSearch className="size-5 text-blue-200" /> : <FileText className="size-5 text-violet-200" />}
                </div>
                <div>
                  <p className="text-sm text-zinc-400">{item.type}</p>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-zinc-300">{item.score}</span>
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
              <Clock3 className="size-4" />
              {item.date}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

