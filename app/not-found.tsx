import Link from "next/link";
import { ArrowLeft, Radar } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export default function NotFound() {
  return (
    <div className="min-h-screen text-white">
      <SiteNav />
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-20 text-center">
        <div className="glass-card max-w-xl rounded-3xl p-10">
          <Radar className="mx-auto size-12 text-violet-300" />
          <h1 className="mt-6 text-5xl font-semibold">404</h1>
          <p className="mt-4 text-xl text-zinc-300">This page is outside the flight path.</p>
          <p className="mt-3 text-zinc-500">
            The route you opened does not exist in HirePilot AI.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-105"
          >
            <ArrowLeft className="size-4" />
            Back Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
