"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ATSGauge } from "@/components/applications/ats-gauge";
import { StatusBadge } from "@/components/applications/status-badge";
import { EmailEditor } from "@/components/applications/email-editor";
import { authFetch } from "@/lib/auth-fetch";
import { ApplicationRecord } from "@/lib/application-types";

export default function ApplicationDetailsPage() {
  const params = useParams<{ id: string }>();
  const [record, setRecord] = useState<ApplicationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    authFetch(`/api/application/details?id=${params.id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecord(data.data);
        setSubject(data.data?.email_subject || "");
        setBody(data.data?.email_body || "");
        setHrEmail(data.data?.hr_email || "");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const onSend = async (file: File | null) => {
    if (!record) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("applicationId", record.id);
      formData.append("hrEmail", hrEmail);
      formData.append("subject", subject);
      formData.append("body", body);
      if (file) {
        formData.append("file", file);
      }

      const res = await authFetch("/api/application/send", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send.");
      toast.success("Email sent!");
      setRecord({ ...record, status: "Applied" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send email.");
    } finally {
      setSending(false);
    }
  };

  const onRegenerate = async () => {
    if (!record) return;
    setRegenerating(true);
    try {
      const res = await authFetch("/api/application/regenerate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: record.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to regenerate.");
      setSubject(data.data.subject);
      setBody(data.data.body);
      toast.success("Email regenerated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Regeneration failed.");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) return <div className="flex min-h-[400px] items-center justify-center"><Loader2 className="size-6 animate-spin" /></div>;
  if (!record) return <div className="glass-card rounded-2xl p-12 text-center">Application not found.</div>;

  const analysis = record.analysis_json;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">Application Details</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">{record.role || "Untitled role"}</h2>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">{record.company || "Company not detected"}</p>
        </div>
        <StatusBadge status={record.status} />
      </section>
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="glass-card rounded-2xl p-6"><ATSGauge score={record.ats_score ?? 0} /></div>
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Timeline</h3>
          <div className="mt-4 space-y-3 text-sm">
            <p>Created: {new Date(record.created_at).toLocaleString()}</p>
            <p>Updated: {new Date(record.updated_at).toLocaleString()}</p>
            <p>Mail Sent: {record.status === "Applied" ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">Original JD</h3>
          <pre className="mt-4 max-h-[420px] overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words rounded-xl bg-black/[0.04] p-4 text-sm leading-7 dark:bg-white/[0.04]">{record.job_description}</pre>
        </section>
        <EmailEditor
          subject={subject}
          body={body}
          hrEmail={hrEmail}
          onSubjectChange={setSubject}
          onBodyChange={setBody}
          onHrEmailChange={setHrEmail}
          onSend={onSend}
          sending={sending}
          onRegenerate={onRegenerate}
          regenerating={regenerating}
        />
      </div>
      {analysis && (
        <section className="glass-card rounded-2xl p-5">
          <h3 className="font-semibold">ATS Report</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["Matching Skills", analysis.matchingSkills],
              ["Missing Skills", analysis.missingSkills],
              ["Keywords", analysis.importantKeywords],
            ].map(([title, items]) => (
              <div key={title as string} className="rounded-xl border border-zinc-200 p-4 dark:border-white/10">
                <h4 className="text-sm font-semibold">{title as string}</h4>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{(items as string[]).join(", ") || "None"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
