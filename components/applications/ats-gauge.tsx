"use client";

export function ATSGauge({ score }: { score: number }) {
  const color = score >= 75 ? "rgb(16 185 129)" : score >= 50 ? "rgb(245 158 11)" : "rgb(239 68 68)";

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid size-36 place-items-center rounded-full"
        style={{ background: `conic-gradient(${color} ${Math.max(0, Math.min(score, 100)) * 3.6}deg, rgba(148,163,184,0.18) 0deg)` }}
      >
        <div className="grid size-28 place-items-center rounded-full bg-background">
          <div className="text-center">
            <p className="text-4xl font-bold">{score}%</p>
            <p className="text-xs text-zinc-500">ATS Match</p>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold">{score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work"}</p>
    </div>
  );
}
