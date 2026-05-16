"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { SiteFooter } from "@/components/site-footer";
import { BrandLogo } from "@/components/brand-logo";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || password.length < 6) {
      toast.error("Use a valid email and a password with at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Account created. Check your inbox for verification.");
    setTimeout(() => router.push("/login"), 1800);
  };

  return (
    <div className="min-h-screen text-white">
      <main className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden border-r border-white/10 bg-white/[0.025] p-10 lg:flex lg:flex-col lg:justify-between">
          <Link href="/">
            <BrandLogo className="text-lg" markClassName="size-9 rounded-lg" />
          </Link>
          <div className="absolute left-16 top-28 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-20 right-16 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-lg"
          >
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-300">
              Start your prep engine
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">
              Build a sharper interview strategy in minutes.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Create your workspace and let AI turn your resume into precise
              questions, answers, and skill recommendations.
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
              <p className="text-sm text-blue-300">Create account</p>
              <h1 className="mt-2 text-3xl font-semibold">Join HirePilot AI</h1>
              <p className="mt-2 text-sm text-zinc-400">
                A verification email will be sent after registration.
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
                    placeholder="Minimum 6 characters"
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

              <div className="flex gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                Supabase authentication protects your account and verification flow.
              </div>

              <button
                type="button"
                onClick={handleRegister}
                disabled={loading}
                className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition hover:scale-[1.02] disabled:opacity-60"
              >
                {loading && <Loader2 className="size-4 animate-spin" />}
                Register
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-zinc-400">
              Already have an account?{" "}
              <Link href="/login" className="text-white underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </motion.div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
