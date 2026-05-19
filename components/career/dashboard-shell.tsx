"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  FileSearch,
  Home,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  ScanSearch,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BrandLogo, BrandMark } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/interview", label: "Interview Generator", icon: MessageSquareText },
  { href: "/dashboard/ats", label: "ATS Score Checker", icon: ScanSearch },
  { href: "/dashboard/jobs", label: "Job Recommendations", icon: BriefcaseBusiness },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: FileSearch },
  { href: "/dashboard/history", label: "History", icon: Clock3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const Sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/10 bg-black/55 px-3 py-4 backdrop-blur-2xl transition-all",
        collapsed ? "w-[84px]" : "w-[280px]"
      )}
    >
      <div className="flex items-center justify-between gap-3 px-2">
        {!collapsed && (
          <Link href="/dashboard" className="min-w-0">
            <BrandLogo className="text-base" markClassName="size-9 rounded-lg" />
          </Link>
        )}
        {collapsed && <BrandMark className="size-9 rounded-lg" />}
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="hidden rounded-lg border border-white/10 bg-white/[0.04] p-2 text-zinc-300 transition hover:bg-white/[0.08] lg:inline-flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-zinc-300 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="mt-8 grid gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-400 transition hover:bg-white/[0.07] hover:text-white",
                active && "border border-white/10 bg-white/[0.09] text-white shadow-lg shadow-blue-500/10",
                collapsed && "justify-center"
              )}
            >
              <item.icon className={cn("size-5 shrink-0", active && "text-blue-200")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className={cn("rounded-xl border border-white/10 bg-white/[0.04] p-3", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
              <UserRound className="size-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{email || "HirePilot user"}</p>
                <p className="text-xs text-zinc-500">AI career workspace</p>
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="size-5" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{Sidebar}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div initial={{ x: -280 }} animate={{ x: 0 }} className="relative h-full w-[280px]">
            {Sidebar}
          </motion.div>
        </div>
      )}

      <div className={cn("transition-all", collapsed ? "lg:pl-[84px]" : "lg:pl-[280px]")}>
        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/60 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
                HirePilot AI
              </p>
              <h1 className="text-lg font-semibold">Career command center</h1>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-zinc-300 sm:flex">
              <BarChart3 className="size-4 text-emerald-300" />
              Production workspace
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
