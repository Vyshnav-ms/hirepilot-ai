import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

const schema = z.object({
  fullName: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  try {
    const input = schema.parse(await req.json());

    // Create or update profile using upsert to handle cases where it might not exist yet
    const { error } = await auth.admin
      .from("profiles")
      .upsert(
        { id: auth.user.id, full_name: input.fullName, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const { data, error } = await auth.admin
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { fullName: data?.full_name || "" } });
}
