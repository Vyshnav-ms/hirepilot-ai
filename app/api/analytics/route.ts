import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";
import { AnalyticsSummary, ApplicationRecord } from "@/lib/application-types";

export const dynamic = "force-dynamic";

function countTerms(records: ApplicationRecord[], key: "matching_skills" | "missing_skills") {
  const counts = new Map<string, number>();
  records.forEach((record) => {
    record[key]?.forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, count]) => ({ label, count }));
}

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data, error } = await auth.admin
    .from("applications")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const records = (data ?? []) as ApplicationRecord[];
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const month = now.toISOString().slice(0, 7);
  const scores = records.map((record) => record.ats_score ?? 0).filter((score) => score > 0);
  const monthly = new Map<string, number>();
  const statuses = new Map<string, number>();

  records.forEach((record) => {
    const label = new Date(record.created_at).toLocaleString("en", { month: "short", year: "2-digit" });
    monthly.set(label, (monthly.get(label) ?? 0) + 1);
    statuses.set(record.status, (statuses.get(record.status) ?? 0) + 1);
  });

  const summary: AnalyticsSummary = {
    applicationsToday: records.filter((record) => record.created_at.startsWith(today)).length,
    applicationsThisMonth: records.filter((record) => record.created_at.startsWith(month)).length,
    averageAts: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    resumeCompletion: 0,
    applicationsPerMonth: Array.from(monthly.entries()).map(([label, count]) => ({ label, count })),
    mostAppliedSkills: countTerms(records, "matching_skills"),
    mostCommonMissingSkills: countTerms(records, "missing_skills"),
    statusBreakdown: Array.from(statuses.entries()).map(([label, count]) => ({ label, count })),
  };

  const { data: resume } = await auth.admin.from("master_resume").select("resume_text").eq("user_id", auth.user.id).maybeSingle();
  summary.resumeCompletion = resume?.resume_text ? Math.min(100, Math.round(resume.resume_text.length / 25)) : 0;

  return NextResponse.json({ success: true, data: summary });
}
