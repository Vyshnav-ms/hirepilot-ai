"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  FileArchive,
  FileSearch,
  LogOut,
  Menu,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
  X,
  Globe,
  Info,
  ShieldCheck,
  Search,
  Bell,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BrandLogo, BrandMark } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/interview", label: "Interview Qs Generator", icon: MessageSquareText },
  { href: "/dashboard/resume-analyzer", label: "Resume Analyzer", icon: FileSearch },
  { href: "/dashboard/applications/new", label: "Applications", icon: BriefcaseBusiness },
  { href: "/dashboard/resume-vault", label: "Resume Vault", icon: FileArchive },
  { href: "/dashboard/applications/history", label: "Application History", icon: BriefcaseBusiness },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      setEmail(user.email || "");
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  const Sidebar = (
    <aside
      className={cn(
        "flex h-full flex-col border-r px-3 py-5 backdrop-blur-2xl transition-all duration-300",
        "border-black/10 dark:border-white/10",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{ background: "var(--hp-sidebar-bg)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-3 px-2 pb-6">
        {!collapsed && (
          <Link href="/" className="min-w-0">
            <BrandLogo className="text-base" markClassName="size-9 rounded-xl" />
          </Link>
        )}
        {collapsed && (
          <Link href="/">
            <BrandMark className="size-9 rounded-xl" />
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="hidden shrink-0 rounded-lg border p-2 text-zinc-500 transition hover:text-foreground lg:inline-flex border-black/10 dark:border-white/10 hover:bg-black/[0.04] dark:hover:bg-white/[0.08]"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="shrink-0 rounded-lg border p-2 text-zinc-500 lg:hidden border-black/10 dark:border-white/10"
          aria-label="Close navigation"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                "text-zinc-600 dark:text-zinc-400",
                "hover:text-zinc-900 dark:hover:text-white",
                active
                  ? "text-violet-700 dark:text-white border border-violet-200 dark:border-white/10"
                  : "border border-transparent",
                collapsed && "justify-center px-2"
              )}
              style={active ? { background: "var(--hp-nav-active-bg)" } : undefined}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  "size-5 shrink-0",
                  active ? "text-violet-600 dark:text-blue-300" : "text-zinc-400 dark:text-zinc-500"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-4 border-t pt-4 border-white/10">
        
        {/* Public Links */}
        <div className="flex flex-col gap-1">
          <Link href="/dashboard/settings" className={cn("flex items-center gap-3 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition", collapsed && "justify-center px-2")}>
            <UserRound className="size-4" />
            {!collapsed && "Profile"}
          </Link>
          <button onClick={handleLogout} className={cn("flex items-center gap-3 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition text-left", collapsed && "justify-center px-2")}>
            <LogOut className="size-4" />
            {!collapsed && "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen text-foreground">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{Sidebar}</div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative h-full w-[260px]"
          >
            {Sidebar}
          </motion.div>
        </div>
      )}

      {/* Main */}
      <div className={cn("flex min-h-screen flex-col transition-all duration-300", collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]")}>
        <header
          className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 px-5 py-4 backdrop-blur-xl"
          style={{ background: "var(--hp-header-bg)" }}
        >
          <div className="flex w-full items-center gap-4 lg:w-1/2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-white/10 p-2 text-zinc-400 transition hover:bg-white/[0.08] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div className="relative hidden w-full max-w-md lg:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search for resumes, jobs, or AI insights..." 
                className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 transition hover:text-white hidden sm:block">
              <Bell className="size-5" />
            </button>
            <div className="flex items-center gap-3 pl-2 sm:border-l border-white/10">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-white">{email ? email.split('@')[0] : "User"}</p>
                <p className="text-[10px] text-zinc-400">{email || "HirePilot Account"}</p>
              </div>
              <div className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-600/20 border border-blue-500/30">
                <UserRound className="size-4 text-blue-400" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-5 py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
