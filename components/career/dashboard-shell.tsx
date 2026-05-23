"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
          <Link href="/dashboard" className="min-w-0">
            <BrandLogo className="text-base" markClassName="size-9 rounded-xl" />
          </Link>
        )}
        {collapsed && <BrandMark className="size-9 rounded-xl" />}
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
          const active = pathname === item.href;
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
      <div className="mt-auto space-y-2 border-t pt-4 border-black/8 dark:border-white/10">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border p-3",
            "border-black/8 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04]",
            collapsed && "justify-center px-2"
          )}
        >
          <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <UserRound className="size-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{email || "User"}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">HirePilot AI</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
            "border-black/8 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04]",
            "text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Logout"}
        </button>
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
          className="sticky top-0 z-30 border-b px-5 py-3.5 backdrop-blur-xl border-black/10 dark:border-white/10"
          style={{ background: "var(--hp-header-bg)" }}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border p-2 transition border-black/10 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.08] lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-violet-600 dark:text-blue-300">
                HirePilot AI
              </p>
              <h1 className="text-base font-semibold leading-tight text-foreground">
                AI Career Platform
              </h1>
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
