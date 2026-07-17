import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";

const schema = z.object({ id: z.uuid() });

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  const body = schema.safeParse(await req.json());
  if (!body.success) return NextResponse.json({ success: false, error: "Valid application id is required." }, { status: 400 });

  const { data: source, error: sourceError } = await auth.admin
    .from("applications")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("id", body.data.id)
    .single();

  if (sourceError) return NextResponse.json({ success: false, error: sourceError.message }, { status: 500 });

  const copy = { ...source };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  const { data, error } = await auth.admin
    .from("applications")
    .insert({ ...copy, status: "Draft", email_subject: source.email_subject ? `Copy: ${source.email_subject}` : null })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
