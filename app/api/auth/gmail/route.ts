import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/gmail";
import { requireApiUser, isAuthContext } from "@/lib/application-auth";

/** GET /api/auth/gmail — Return the Google OAuth URL for the client to navigate to */
export async function GET(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  try {
    // Embed userId in the OAuth state param so the callback can identify the user
    const url = getAuthUrl(auth.user.id);
    // Return the URL as JSON — the client will navigate to it
    // (We can't do a server redirect here because the browser <a> tag doesn't send auth headers)
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth config error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
