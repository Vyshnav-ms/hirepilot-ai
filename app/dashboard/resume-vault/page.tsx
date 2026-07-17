"use client";

import { startTransition, useEffect, useState } from "react";
import { FileText, Loader2, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
import { MasterResume } from "@/lib/application-types";

type ResumeResponse = MasterResume & { signedUrl?: string | null };

export default function ResumeVaultPage() {
  const [resume, setResume] = useState<ResumeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadResume = async () => {
    setLoading(true);
    try {
      const response = await authFetch("/api/resume/details");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load resume.");
      setResume(data.data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load resume.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      void loadResume();
    });
  }, []);

  const upload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await authFetch("/api/resume/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setResume(data.data);
      toast.success("Master resume saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const remove = async () => {
    const response = await authFetch("/api/resume/details", { method: "DELETE" });
    if (response.ok) {
      setResume(null);
      toast.success("Master resume deleted.");
    }
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Resume Vault</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Your permanent master resume.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          Upload one resume once. HirePilot uses it automatically for every application analysis and email.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <div className="glass-card rounded-2xl p-5">
          <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center transition hover:bg-zinc-100 dark:border-white/15 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
            {uploading ? <Loader2 className="size-10 animate-spin text-blue-500" /> : <UploadCloud className="size-10 text-blue-500" />}
            <span className="mt-4 font-semibold">{resume ? "Replace Resume" : "Upload Resume"}</span>
            <span className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">PDF or DOCX, up to 8MB</span>
            <input className="sr-only" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] ?? null)} />
          </label>
          {resume && (
            <div className="mt-4 flex gap-2">
              <Button type="button" variant="outline" onClick={loadResume}><RefreshCw className="size-4" /> Refresh</Button>
              <Button type="button" variant="destructive" onClick={remove}><Trash2 className="size-4" /> Delete</Button>
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>
          ) : !resume ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <FileText className="size-12 text-zinc-300 dark:text-zinc-700" />
              <p className="mt-4 font-semibold">No master resume yet</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Upload your resume to unlock application analysis.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold">Extracted Resume Profile</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Updated {new Date(resume.updated_at).toLocaleString()}</p>
                </div>
                {resume.signedUrl && <Button asChild variant="outline"><a href={resume.signedUrl} target="_blank" rel="noreferrer">Preview</a></Button>}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-white/[0.02]">
                {resume.signedUrl ? (
                  <iframe
                    src={`${resume.signedUrl}#view=FitH`}
                    className="h-[600px] w-full border-none"
                    title="Master Resume Document"
                  />
                ) : (
                  <div className="flex h-[400px] items-center justify-center text-sm text-zinc-500">
                    Preview not available.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
