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
        "sticky top-0 z-50 border-b border-white/10 transition-all",
        scrolled ? "bg-black/70 shadow-xl shadow-black/30 backdrop-blur-xl" : "bg-black/35 backdrop-blur-md"
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
                "rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white",
                pathname === link.href && "bg-white/8 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white">
            Login
          </Link>
          <Link href="/register" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-violet-500/10 transition hover:scale-105">
            Register
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-white/10 px-6 pb-5 md:hidden"
        >
          <div className="grid gap-2 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link href="/login" className="rounded-lg border border-white/10 px-4 py-3 text-center text-sm">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-black">
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
