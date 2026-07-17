import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data, error } = await auth.admin.from("master_resume").select("*").eq("user_id", auth.user.id).maybeSingle();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ success: true, data: null });

  const { data: signed } = await auth.admin.storage.from("resumes").createSignedUrl(data.resume_url, 60 * 60);
  return NextResponse.json({ success: true, data: { ...data, signedUrl: signed?.signedUrl ?? null } });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data } = await auth.admin.from("master_resume").select("resume_url").eq("user_id", auth.user.id).maybeSingle();
  if (data?.resume_url) await auth.admin.storage.from("resumes").remove([data.resume_url]);
  const { error } = await auth.admin.from("master_resume").delete().eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
