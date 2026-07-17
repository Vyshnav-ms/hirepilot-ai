import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

export const dynamic = "force-dynamic";

const idSchema = z.object({ id: z.uuid() });

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const parsed = idSchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Valid application id is required." }, { status: 400 });

  const { data, error } = await auth.admin
    .from("applications")
    .select("*, email_logs(*)")
    .eq("user_id", auth.user.id)
    .eq("id", parsed.data.id)
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
