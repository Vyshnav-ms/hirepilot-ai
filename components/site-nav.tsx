"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand-logo";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        "border-black/10 dark:border-white/10",
        scrolled
          ? "bg-white/90 dark:bg-black/70 shadow-sm shadow-black/5 dark:shadow-black/30 backdrop-blur-xl"
          : "bg-white/70 dark:bg-black/35 backdrop-blur-md"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/">
          <BrandLogo markClassName="size-9 rounded-lg" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition",
                "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
                "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
                pathname === link.href && "text-zinc-900 dark:text-white bg-black/[0.05] dark:bg-white/[0.07]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.06] hover:text-zinc-900 dark:hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black shadow-lg shadow-violet-500/10 transition hover:scale-105"
          >
            Register
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="grid size-10 place-items-center rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-black/10 dark:border-white/10 px-6 pb-5 md:hidden bg-white/95 dark:bg-black/80"
        >
          <div className="grid gap-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" className="rounded-lg border border-black/10 dark:border-white/10 px-4 py-3 text-center text-sm text-zinc-700 dark:text-zinc-300">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-zinc-900 dark:bg-white px-4 py-3 text-center text-sm font-semibold text-white dark:text-black">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
