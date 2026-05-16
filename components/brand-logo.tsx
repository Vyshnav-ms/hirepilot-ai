import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/15 bg-black shadow-lg shadow-violet-500/20",
        className
      )}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(96,165,250,0.95),transparent_35%),radial-gradient(circle_at_74%_74%,rgba(168,85,247,0.9),transparent_38%)]" />
      <span className="absolute inset-[3px] rounded-[10px] bg-black/65 backdrop-blur-sm" />
      <span className="absolute left-1/2 top-1/2 h-6 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.5)]" />
      <span className="absolute left-[9px] top-[10px] h-5 w-2 rotate-[-34deg] rounded-full bg-blue-300" />
      <span className="absolute right-[9px] bottom-[10px] h-5 w-2 rotate-[-34deg] rounded-full bg-violet-300" />
    </span>
  );
}

export function BrandLogo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <BrandMark className={markClassName} />
      <span>HirePilot AI</span>
    </span>
  );
}
