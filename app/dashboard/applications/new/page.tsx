"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, FileText, ImageIcon, Loader2, Mail, Sparkles, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ATSGauge } from "@/components/applications/ats-gauge";
import { EmailEditor } from "@/components/applications/email-editor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authFetch } from "@/lib/auth-fetch";
import { JobApplicationAnalysis } from "@/lib/application-types";

type AnalyzeResponse = {
  application: { id: string; hr_email?: string | null };
  analysis: JobApplicationAnalysis;
  emails: string[];
};

export default function NewApplicationPage() {
  const [jdText, setJdText] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [hrEmail, setHrEmail] = useState("");
  const [analysis, setAnalysis] = useState<JobApplicationAnalysis | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    authFetch("/api/auth/gmail/status")
      .then((r) => r.json())
      .then((d) => setGmailConnected(d.connected ?? false))
      .catch(() => setGmailConnected(false));
  }, []);

  const wordCount = useMemo(() => jdText.trim().split(/\s+/).filter(Boolean).length, [jdText]);

  const parseText = async (text: string) => {
    const response = await authFetch("/api/jd/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to parse job description.");
    setJdText(data.data.text);
    setEmails(data.data.emails);
    setHrEmail(data.data.emails[0] ?? "");
  };

  const parseFile = async (file: File | null) => {
    if (!file) return;
    setParsing(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await authFetch("/api/jd/parse", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to parse file.");
      setJdText(data.data.text);
      setEmails(data.data.emails);
      setHrEmail(data.data.emails[0] ?? "");
      toast.success("Job description parsed.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to parse file.");
    } finally {
      setParsing(false);
    }
  };

  const analyze = async () => {
    if (wordCount < 20) {
      toast.error("Add a fuller job description before analyzing.");
      return;
    }
    setAnalyzing(true);
    try {
      await parseText(jdText);
      const formData = new FormData();
      formData.append("jobDescription", jdText);
      if (hrEmail) formData.append("hrEmail", hrEmail);
      if (resumeFile) formData.append("resumeFile", resumeFile);
      const response = await authFetch("/api/application/analyze", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { success: boolean; data?: AnalyzeResponse; error?: string };
      if (!response.ok || !data.data) throw new Error(data.error || "Analysis failed.");
      setAnalysis(data.data.analysis);
      setApplicationId(data.data.application.id);
      setSubject(data.data.analysis.emailSubject);
      setEmailBody(data.data.analysis.professionalEmail);
      setEmails(data.data.emails);
      setHrEmail(data.data.application.hr_email ?? data.data.emails[0] ?? hrEmail);
      toast.success("Application analysis generated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };

  const send = async (file: File | null) => {
    if (!applicationId) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("applicationId", applicationId);
      formData.append("hrEmail", hrEmail);
      formData.append("subject", subject);
      formData.append("body", emailBody);
      if (file) {
        formData.append("file", file);
      } else if (resumeFile) {
        // Use the optional resume uploaded during analysis
        formData.append("file", resumeFile);
      }

      const response = await authFetch("/api/application/send", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send.");
      toast.success(data.data?.status === "sent" ? "Application email sent." : "Email saved as draft.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send.");
    } finally {
      setSending(false);
    }
  };

  const regenerate = async () => {
    if (!applicationId) return;
    setRegenerating(true);
    try {
      const response = await authFetch("/api/application/regenerate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to regenerate.");
      setSubject(data.data.subject);
      setEmailBody(data.data.body);
      toast.success("Email regenerated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to regenerate.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">New Application</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Analyze a role and draft the outreach.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
          HirePilot compares the job description with your master resume, scores the match, and creates a professional HR email.
        </p>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">1</div>
          <div>
            <h3 className="font-semibold">Choose Job Description</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Paste text or upload PDF, DOCX, PNG, JPEG, or WEBP.</p>
          </div>
        </div>
        <Tabs defaultValue="text">
          <TabsList>
            <TabsTrigger value="text"><FileText className="size-4" /> Text</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="docx">DOCX</TabsTrigger>
            <TabsTrigger value="image"><ImageIcon className="size-4" /> Image</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="mt-4">
            <textarea className="premium-input min-h-[300px] w-full resize-y p-4 text-sm leading-7" value={jdText} onBlur={() => parseText(jdText).catch(() => undefined)} onChange={(event) => setJdText(event.target.value)} placeholder="Paste the job description here..." />
          </TabsContent>
          {["pdf", "docx", "image"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-white/15 dark:bg-white/[0.03]">
                {parsing ? <Loader2 className="size-8 animate-spin text-blue-500" /> : <BriefcaseBusiness className="size-8 text-blue-500" />}
                <span className="mt-3 font-semibold">Upload {tab.toUpperCase()} job description</span>
                <span className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">The extracted text will appear below for editing.</span>
                <input className="sr-only" type="file" accept={tab === "pdf" ? ".pdf,application/pdf" : tab === "docx" ? ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" : ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"} onChange={(event) => parseFile(event.target.files?.[0] ?? null)} />
              </label>
            </TabsContent>
          ))}
        </Tabs>
        {/* Optional resume upload */}
        <div className="mt-5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4 dark:border-white/10 dark:bg-white/[0.02]">
          <div className="mb-3 flex items-center gap-2">
            <Upload className="size-4 text-blue-500" />
            <p className="text-sm font-medium">Custom Resume <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">(optional)</span></p>
          </div>
          <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
            Upload a specific resume for this application. If skipped, your master resume will be used.
          </p>
          {resumeFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 dark:border-blue-500/20 dark:bg-blue-500/10">
              <FileText className="size-4 shrink-0 text-blue-600 dark:text-blue-300" />
              <span className="flex-1 truncate text-sm font-medium text-blue-700 dark:text-blue-200">{resumeFile.name}</span>
              <button type="button" onClick={() => setResumeFile(null)} className="rounded-full p-0.5 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-500/20" aria-label="Remove resume">
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-blue-500/30 dark:hover:bg-blue-500/5">
              <Upload className="size-4 text-zinc-400" />
              Choose PDF or DOCX
              <input className="sr-only" type="file" accept=".pdf,application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => { const f = e.target.files?.[0]; if (f) setResumeFile(f); e.target.value = ""; }} />
            </label>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">{wordCount} words extracted</p>
          {emails.length > 0 && (
            <select className="premium-input h-10 px-3 text-sm" value={hrEmail} onChange={(event) => setHrEmail(event.target.value)} aria-label="Detected HR email">
              {emails.map((email) => <option key={email}>{email}</option>)}
            </select>
          )}
          <Button type="button" size="lg" onClick={analyze} disabled={analyzing}>
            {analyzing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            Analyze{resumeFile ? " Custom" : ""} Resume + JD
          </Button>
        </div>
      </section>

      {analysis && (
        <section className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
            <div className="glass-card rounded-2xl p-6"><ATSGauge score={analysis.atsScore} /></div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["Keyword Match", analysis.keywordMatch],
                ["Experience Match", analysis.experienceMatch],
                ["Education Match", analysis.educationMatch],
                ["Projects Match", analysis.projectsMatch],
                ["Confidence", analysis.confidence],
              ].map(([label, value]) => (
                <div key={label as string} className="glass-card rounded-2xl p-5">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{label as string}</p>
                  <p className="mt-2 text-3xl font-bold">{value as number}%</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              ["Matching Skills", analysis.matchingSkills, "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20"],
              ["Missing Skills", analysis.missingSkills, "text-red-700 bg-red-50 border-red-200 dark:text-red-200 dark:bg-red-500/10 dark:border-red-500/20"],
              ["Important Keywords", analysis.importantKeywords, "text-orange-700 bg-orange-50 border-orange-200 dark:text-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20"],
            ].map(([title, items, chip]) => (
              <div key={title as string} className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold">{title as string}</h3>
                <div className="mt-4 flex flex-wrap gap-2">{(items as string[]).map((item) => <span key={item} className={`rounded-full border px-3 py-1 text-xs font-semibold ${chip}`}>{item}</span>)}</div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-semibold">Resume Improvement Suggestions</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {analysis.improvementSuggestions.map((item) => (
                <div key={item.text} className="rounded-xl border border-zinc-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
                  <span className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-300">{item.priority}</span>
                  <p className="mt-1 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {gmailConnected === false && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
              <Mail className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-300" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">Gmail not connected</p>
                <p className="text-xs text-amber-600/80 dark:text-amber-300/70 mt-0.5">
                  Connect your Gmail in{" "}
                  <Link href="/dashboard/settings" className="underline font-semibold">Settings</Link>
                  {" "}to send this email directly from your inbox.
                </p>
              </div>
            </div>
          )}
          <EmailEditor subject={subject} body={emailBody} hrEmail={hrEmail} onSubjectChange={setSubject} onBodyChange={setEmailBody} onHrEmailChange={setHrEmail} onSend={send} sending={sending} onRegenerate={regenerate} regenerating={regenerating} defaultAttachmentName={resumeFile ? resumeFile.name : undefined} />
        </section>
      )}
    </div>
  );
}
