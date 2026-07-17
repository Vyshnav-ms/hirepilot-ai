import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

/** GET /api/auth/gmail/status — Check if current user has Gmail connected */
export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data, error } = await auth.admin
    .from("gmail_tokens")
    .select("gmail_email, expiry_date")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ connected: false, email: null });
  }

  return NextResponse.json({
    connected: true,
    email: data.gmail_email,
    expiry: data.expiry_date,
  });
}
