"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Enter your email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back to HirePilot AI.");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen text-white">
      <main className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-white/[0.025] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link href="/">
            <BrandLogo className="text-lg" markClassName="size-9 rounded-lg" />
          </Link>
          <div className="absolute left-20 top-32 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="absolute bottom-20 right-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-lg"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
              Interview command center
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">
              Prepare sharper, answer calmer, walk in ready.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Return to your AI workspace for structured technical questions,
              HR practice, and role-specific skill insights.
            </p>
          </motion.div>
        </section>

        <section className="flex items-center justify-center px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card w-full max-w-md rounded-3xl p-8"
          >
            <div className="mb-8">
              <p className="text-sm text-violet-300">Secure login</p>
              <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Continue building your AI-powered interview preparation plan.
              </p>
            </div>

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm">
                Email
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="premium-input h-12 w-full rounded-xl pl-10 pr-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm">
                Password
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="premium-input h-12 w-full rounded-xl px-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Login
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              New to HirePilot AI?{" "}
              <Link href="/register" className="text-white underline-offset-4 hover:underline">
                Create an account
              </Link>
            </p>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
