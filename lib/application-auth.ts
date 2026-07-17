import { NextRequest, NextResponse } from "next/server";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

type AuthContext = {
  user: User;
  admin: SupabaseClient;
};

export async function requireApiUser(req: NextRequest): Promise<AuthContext | NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const admin = createSupabaseAdmin();

  if (!url || !anonKey || !admin) {
    return NextResponse.json({ success: false, error: "Supabase is not configured." }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    return NextResponse.json({ success: false, error: "Authentication is required." }, { status: 401 });
  }

  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.json({ success: false, error: "Invalid session." }, { status: 401 });
  }

  return { user: data.user, admin };
}

export function isAuthContext(value: AuthContext | NextResponse): value is AuthContext {
  return "user" in value;
}
