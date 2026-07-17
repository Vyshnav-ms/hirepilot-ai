import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGmailUserEmail } from "@/lib/gmail";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** GET /api/auth/gmail/callback — Handle Google OAuth callback */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  // userId was embedded in the OAuth state param by /api/auth/gmail
  const userId = searchParams.get("state");

  // User denied access or missing state
  if (error || !code || !userId) {
    return NextResponse.redirect(
      `${APP_URL}/dashboard/settings?gmail=denied`
    );
  }

  try {
    const admin = createSupabaseAdmin();
    if (!admin) throw new Error("Admin client unavailable.");

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("Incomplete token response from Google. Make sure offline access is enabled.");
    }

    // Get the Gmail email address for this access token
    const gmailEmail = await getGmailUserEmail(tokens.access_token);

    const expiryDate = tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString();

    // Upsert tokens keyed by userId from state param
    const { error: upsertError } = await admin
      .from("gmail_tokens")
      .upsert(
        {
          user_id: userId,
          gmail_email: gmailEmail,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: expiryDate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

    if (upsertError) throw new Error(upsertError.message);

    return NextResponse.redirect(
      `${APP_URL}/dashboard/settings?gmail=connected&email=${encodeURIComponent(gmailEmail)}`
    );
  } catch (err) {
    console.error("Gmail OAuth callback error:", err);
    const msg = err instanceof Error ? err.message : "OAuth failed";
    return NextResponse.redirect(
      `${APP_URL}/dashboard/settings?gmail=error&message=${encodeURIComponent(msg)}`
    );
  }
}
