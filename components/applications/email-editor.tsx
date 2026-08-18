"use client";

import { Copy, Mail, Save, Send, RefreshCw, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

type EmailEditorProps = {
  subject: string;
  body: string;
  hrEmail: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onHrEmailChange: (value: string) => void;
  onSend: (file: File | null) => void;
  onRegenerate?: () => void;
  sending?: boolean;
  regenerating?: boolean;
  defaultAttachmentName?: string;
};

export function EmailEditor(props: EmailEditorProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${props.subject}\n\n${props.body}`);
    toast.success("Email copied.");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <section className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold">Generated Email</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Edit before sending or saving the draft.</p>
        </div>
        <Mail className="size-5 text-blue-500" />
      </div>
      <div className="space-y-3">
        <input className="premium-input h-11 w-full px-3 text-sm" value={props.hrEmail} onChange={(event) => props.onHrEmailChange(event.target.value)} placeholder="hr@example.com" aria-label="HR email" />
        <input className="premium-input h-11 w-full px-3 text-sm" value={props.subject} onChange={(event) => props.onSubjectChange(event.target.value)} placeholder="Email subject" aria-label="Email subject" />
        <textarea className="premium-input min-h-[260px] w-full resize-y p-4 text-sm leading-7" value={props.body} onChange={(event) => props.onBodyChange(event.target.value)} placeholder="Email body" aria-label="Email body" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
        <Button type="button" onClick={copy} variant="outline"><Copy className="size-4" /> Copy</Button>
        <Button type="button" variant="outline"><Save className="size-4" /> Save Draft</Button>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-white/10">
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="size-3.5 mr-1" /> Attach
          </Button>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 max-w-[160px] truncate">
            {file ? file.name : props.defaultAttachmentName || "Master Resume"}
          </span>
          {file && (
            <button type="button" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => setFile(null)}>
              <X className="size-3.5" />
            </button>
          )}
        </div>
        {props.onRegenerate && (
          <Button type="button" variant="outline" onClick={props.onRegenerate} disabled={props.regenerating}>
            <RefreshCw className={`size-4 ${props.regenerating ? "animate-spin" : ""}`} />
            {props.regenerating ? "Regenerating..." : "Regenerate"}
          </Button>
        )}
        <Button type="button" onClick={() => props.onSend(file)} disabled={props.sending}><Send className="size-4" /> {props.sending ? "Sending..." : "Send"}</Button>
      </div>
    </section>
  );
}
