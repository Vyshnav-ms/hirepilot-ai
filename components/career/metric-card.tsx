"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = "blue",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  helper: string;
  tone?: "blue" | "green" | "orange" | "pink" | "purple";
}) {
  const tones = {
    blue: "from-blue-500/20 to-cyan-500/10 text-blue-200",
    green: "from-emerald-500/20 to-teal-500/10 text-emerald-200",
    orange: "from-orange-500/20 to-amber-500/10 text-orange-200",
    pink: "from-pink-500/20 to-fuchsia-500/10 text-pink-200",
    purple: "from-violet-500/20 to-blue-500/10 text-violet-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className={cn("inline-flex rounded-xl bg-gradient-to-br p-3", tones[tone])}>
        <Icon className="size-5" />
      </div>
      <p className="mt-5 text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </motion.div>
  );
}

