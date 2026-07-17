import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function readEnv() {
  const envText = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
  return Object.fromEntries(
    envText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^["']|["']$/g, "")];
      })
  );
}

const env = { ...readEnv(), ...process.env };
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const requiredTables = [
  "master_resume",
  "applications",
  "application_documents",
  "email_logs",
  "analytics_cache",
];

const results = [];

for (const table of requiredTables) {
  const { error } = await supabase.from(table).select("*", { count: "exact", head: true });
  results.push({
    table,
    ok: !error,
    message: error?.message ?? "available",
  });
}

const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
if (bucketListError) {
  results.push({ table: "storage.resumes", ok: false, message: bucketListError.message });
} else if (!buckets.some((bucket) => bucket.id === "resumes")) {
  const { error } = await supabase.storage.createBucket("resumes", {
    public: false,
    fileSizeLimit: 8 * 1024 * 1024,
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  });
  results.push({ table: "storage.resumes", ok: !error, message: error?.message ?? "created" });
} else {
  results.push({ table: "storage.resumes", ok: true, message: "available" });
}

for (const result of results) {
  console.log(`${result.ok ? "OK" : "MISSING"} ${result.table}: ${result.message}`);
}

const missingTables = results.filter((result) => !result.ok && result.table !== "storage.resumes");
if (missingTables.length > 0) {
  process.exitCode = 2;
}
