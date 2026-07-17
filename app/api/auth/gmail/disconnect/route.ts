import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

/** POST /api/auth/gmail/disconnect — Remove stored Gmail tokens */
export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { error } = await auth.admin
    .from("gmail_tokens")
    .delete()
    .eq("user_id", auth.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Gmail disconnected." });
}
