"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  AlertTriangle,
  Check,
  Link2Off,
  Lock,
  LogOut,
  Mail,
  User,
  Monitor,
  Loader2,
  Moon,
  Save,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/auth-fetch";
import { cn } from "@/lib/utils";

type GmailStatus = { connected: false; email: null } | { connected: true; email: string };

/* ─── Gmail Connection Card ───────────────────────────────────────── */
function GmailCard() {
  const [status, setStatus] = useState<GmailStatus>({ connected: false, email: null });
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const searchParams = useSearchParams();

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/auth/gmail/status");
      const data = await res.json();
      if (res.ok) setStatus(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    // Show toast based on OAuth redirect result
    const gmail = searchParams.get("gmail");
    if (gmail === "connected") {
      const email = searchParams.get("email") ?? "";
      toast.success(`Gmail connected: ${email}`);
    } else if (gmail === "denied") {
      toast.error("Gmail connection was denied.");
    } else if (gmail === "error") {
      toast.error(searchParams.get("message") ?? "Gmail connection failed.");
    }
  }, [loadStatus, searchParams]);

  const connectGmail = async () => {
    setConnecting(true);
    try {
      const res = await authFetch("/api/auth/gmail");
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Could not start Gmail connection."); return; }
      // Navigate the browser to the Google consent screen
      window.location.href = data.url;
    } catch {
      toast.error("Could not start Gmail connection.");
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    setDisconnecting(true);
    try {
      const res = await authFetch("/api/auth/gmail/disconnect", { method: "POST" });
      if (res.ok) {
        setStatus({ connected: false, email: null });
        toast.success("Gmail disconnected.");
      }
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-lg bg-blue-500/15">
          <Mail className="size-4 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Gmail Connection</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Send job applications from your own Gmail inbox</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="size-4 animate-spin" /> Checking connection...
        </div>
      ) : status.connected ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <Check className="size-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <div>
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">Connected</p>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-300/70">{status.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={disconnect}
            disabled={disconnecting}
            className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 hover:border-red-200 dark:hover:border-red-500/20 disabled:opacity-60"
          >
            {disconnecting ? <Loader2 className="size-4 animate-spin" /> : <Link2Off className="size-4" />}
            Disconnect Gmail
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Connect your Gmail so HirePilot can send application emails directly from your inbox.
          </p>
          <button
            type="button"
            onClick={connectGmail}
            disabled={connecting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {connecting ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
            {connecting ? "Redirecting to Google..." : "Connect Gmail"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Delete Confirmation Modal ───────────────────────────────────── */
function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const confirmed = input === "DELETE";

  const handleDelete = async () => {
    if (!confirmed) return;
    setDeleting(true);
    try {
      await supabase.auth.signOut();
      toast.success("Account deletion request submitted. You have been logged out.");
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Deletion failed.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-white dark:bg-zinc-950 p-6 shadow-2xl shadow-red-500/10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-red-500/15">
              <AlertTriangle className="size-5 text-red-500" />
            </div>
            <h3 className="font-bold text-zinc-900 dark:text-red-100">Delete Account</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition">
            <X className="size-4" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          This action is <span className="font-semibold text-red-600 dark:text-red-300">permanent and irreversible</span>. Your account and all associated data will be permanently deleted.
        </p>
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Type <span className="text-red-600 dark:text-red-300">DELETE</span> to confirm
          </p>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DELETE"
            className="h-11 w-full rounded-xl border border-red-300 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 px-4 text-sm font-mono text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-400/30"
          />
        </div>
        <div className="mt-5 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-black/[0.06] dark:hover:bg-white/[0.08]">
            Cancel
          </button>
          <button type="button" onClick={handleDelete} disabled={!confirmed || deleting} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40">
            {deleting ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Settings Page ───────────────────────────────────────────────── */
export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [savingFullName, setSavingFullName] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
    
    authFetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.fullName) {
          setFullName(data.data.fullName);
        }
      })
      .catch(console.error);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        const userEmail = user.email;
        startTransition(() => setEmail(userEmail));
      }
    });
  }, []);

  const handlePasswordUpdate = async () => {
    if (!newPassword.trim()) { toast.error("New password cannot be empty."); return; }
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match."); return; }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword(""); setConfirmPassword("");
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Password update failed.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleFullNameUpdate = async () => {
    if (!fullName.trim()) { toast.error("Name cannot be empty."); return; }
    setSavingFullName(true);
    try {
      const res = await authFetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to update name.");
      toast.success("Name updated successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSavingFullName(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out.");
    router.push("/login");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun, desc: "White theme" },
    { value: "dark", label: "Dark", icon: Moon, desc: "Dark theme" },
    { value: "system", label: "System", icon: Monitor, desc: "Auto-detect" },
  ];

  const inputClass = "h-11 w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.04] dark:bg-white/[0.06] px-4 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400/60 transition";

  return (
    <>
      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}

      <div className="space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Settings</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Account & Preferences</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Manage your theme, password, and account settings.
          </p>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Account Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="mb-5 font-semibold text-foreground">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Email Address</label>
                <input value={email} readOnly className={cn(inputClass, "cursor-not-allowed opacity-60")} />
                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">Email cannot be changed from the dashboard.</p>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  <User className="size-3.5" /> Full Name
                </label>
                <div className="flex gap-2">
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your Name" className={inputClass} />
                  <button type="button" onClick={handleFullNameUpdate} disabled={savingFullName} className="inline-flex items-center justify-center rounded-xl bg-zinc-900 dark:bg-white px-4 text-sm font-semibold text-white dark:text-black transition hover:scale-[1.02] disabled:opacity-60">
                    <Save className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Theme card removed — forced to clean light mode */}

          {/* Change Password */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-emerald-500/15">
                <Lock className="size-4 text-emerald-600 dark:text-emerald-300" />
              </div>
              <h3 className="font-semibold text-foreground">Change Password</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat new password" className={inputClass} />
              </div>
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-2 text-xs text-red-500">Passwords do not match.</p>
            )}
            <button type="button" onClick={handlePasswordUpdate} disabled={savingPassword} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black transition hover:scale-[1.02] disabled:opacity-60">
              <Save className="size-4" />
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* Gmail Connection */}
          <GmailCard />

          {/* Logout */}
          <div className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-500/15">
                <LogOut className="size-4 text-zinc-600 dark:text-zinc-300" />
              </div>
              <h3 className="font-semibold text-foreground">Logout</h3>
            </div>
            <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">Sign out of your HirePilot AI account.</p>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-zinc-900 dark:hover:text-white">
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/[0.06] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-red-100 dark:bg-red-500/15">
                <Trash2 className="size-4 text-red-600 dark:text-red-300" />
              </div>
              <h3 className="font-semibold text-red-700 dark:text-red-100">Danger Zone</h3>
            </div>
            <p className="mb-4 text-sm leading-6 text-red-600/70 dark:text-red-100/60">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button type="button" onClick={() => setShowDeleteModal(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-100 dark:bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-700 dark:text-red-200 transition hover:bg-red-200 dark:hover:bg-red-500/20">
              <Trash2 className="size-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
