import Link from "next/link";
import { GitBranch, Link2, Mail } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <Link href="/">
            <BrandLogo className="text-lg" markClassName="size-9 rounded-lg" />
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">
            AI-Powered Interview Preparation Platform for focused, confident,
            role-ready candidates.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-white">Navigation</p>
          <div className="mt-3 grid gap-2 text-sm text-zinc-400">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            {[GitBranch, Link2, Mail].map((Icon, index) => (
              <span
                key={index}
                className="grid size-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-zinc-400"
              >
                <Icon className="size-4" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-center text-sm text-zinc-500">
        &copy; 2026 HirePilot AI. All rights reserved. Developed by Vyshnav M S
      </div>
    </footer>
  );
}
