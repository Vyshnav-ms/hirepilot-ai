"use client";

import { Bell, GitBranch, Link, Lock, Save, Shield, Sparkles, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";

const sections = [
  { icon: UserRound, title: "Profile Settings", text: "Name, bio, skills, education, experience, and profile image." },
  { icon: Lock, title: "Account Settings", text: "Password reset, login email, and authenticated session controls." },
  { icon: Sparkles, title: "AI Preferences", text: "Question depth, answer style, target difficulty, and job sources." },
  { icon: Bell, title: "Notification Settings", text: "Interview reminders, report completion alerts, and saved job updates." },
  { icon: Shield, title: "Privacy Controls", text: "Resume retention, AI processing consent, and account deletion." },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
          Settings
        </p>
        <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
          Personalize your AI career workspace.
        </h2>
        <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
          Manage profile data, AI preferences, security settings, notifications, and privacy controls.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-2xl p-6">
          <div className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500">
            <UserRound className="size-9" />
          </div>
          <h3 className="mt-5 text-2xl font-semibold">Vyshnav M S</h3>
          <p className="mt-2 text-zinc-400">Full Stack Developer · AI Enthusiast</p>
          <div className="mt-5 grid gap-3">
            <input placeholder="Full name" className="premium-input h-12 rounded-xl px-4" />
            <input placeholder="Bio" className="premium-input h-12 rounded-xl px-4" />
            <input placeholder="Skills" className="premium-input h-12 rounded-xl px-4" />
            <input placeholder="Education" className="premium-input h-12 rounded-xl px-4" />
            <input placeholder="Experience" className="premium-input h-12 rounded-xl px-4" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <Link className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input placeholder="LinkedIn URL" className="premium-input h-12 w-full rounded-xl pl-10 pr-4" />
              </div>
              <div className="relative">
                <GitBranch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                <input placeholder="GitHub URL" className="premium-input h-12 w-full rounded-xl pl-10 pr-4" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toast.success("Profile settings saved.")}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:scale-[1.02]"
          >
            <Save className="size-4" />
            Save Changes
          </button>
        </div>

        <div className="grid gap-4">
          {sections.map((section) => (
            <div key={section.title} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="grid size-11 place-items-center rounded-xl bg-white/[0.06]">
                  <section.icon className="size-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-400">{section.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5">
            <div className="flex items-center gap-3">
              <Trash2 className="size-5 text-red-200" />
              <h3 className="font-semibold text-red-100">Delete Account</h3>
            </div>
            <p className="mt-2 text-sm leading-6 text-red-100/70">
              Permanently remove profile data, saved jobs, resume uploads, ATS reports, and interview sessions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
