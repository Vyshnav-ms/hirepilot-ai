import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data, error } = await auth.admin
    .from("applications")
    .select("*")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data: data ?? [] });
}
