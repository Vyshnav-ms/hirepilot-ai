import { Loader2 } from "lucide-react";
import { BrandMark } from "@/components/brand-logo";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center text-white">
      <div className="glass-card rounded-2xl p-8 text-center">
        <BrandMark className="mx-auto" />
        <Loader2 className="mx-auto mt-5 size-7 animate-spin text-blue-300" />
        <p className="mt-4 text-sm text-zinc-400">Loading HirePilot AI...</p>
      </div>
    </div>
  );
}
