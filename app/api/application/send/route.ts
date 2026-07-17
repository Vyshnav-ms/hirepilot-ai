import { NextRequest, NextResponse } from "next/server";
import { isAuthContext, requireApiUser } from "@/lib/application-auth";
import { sendViaGmail, refreshAccessToken } from "@/lib/gmail";

export async function POST(req: NextRequest) {
  const auth = await requireApiUser(req);
  if (!isAuthContext(auth)) return auth;

  let applicationId: string;
  let hrEmail: string;
  let subject: string;
  let body: string;
  let customFile: File | null = null;

  try {
    const formData = await req.formData();
    applicationId = formData.get("applicationId") as string;
    hrEmail = formData.get("hrEmail") as string;
    subject = formData.get("subject") as string;
    body = formData.get("body") as string;
    customFile = formData.get("file") as File | null;

    if (!applicationId || !hrEmail || !subject || !body) {
      throw new Error("Missing required fields.");
    }
  } catch (err) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  /* ── 1. Fetch Gmail tokens ─────────────────────────────────────── */
  const { data: tokenRow, error: tokenError } = await auth.admin
    .from("gmail_tokens")
    .select("access_token, refresh_token, expiry_date, gmail_email")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (tokenError) {
    return NextResponse.json({ error: tokenError.message }, { status: 500 });
  }

  if (!tokenRow) {
    return NextResponse.json(
      {
        error:
          "Gmail not connected. Please connect your Gmail account in Settings before sending.",
      },
      { status: 400 }
    );
  }

  /* ── 2. Refresh token if expired ───────────────────────────────── */
  let { access_token: accessToken } = tokenRow;

  const isExpired = new Date(tokenRow.expiry_date) <= new Date(Date.now() + 60_000);
  if (isExpired) {
    try {
      const refreshed = await refreshAccessToken(tokenRow.refresh_token);
      accessToken = refreshed.access_token;

      // Persist the new access token
      await auth.admin
        .from("gmail_tokens")
        .update({
          access_token: refreshed.access_token,
          expiry_date: new Date(refreshed.expiry_date).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", auth.user.id);
    } catch (err) {
      console.error("Token refresh failed:", err);
      return NextResponse.json(
        { error: "Gmail token expired. Please reconnect your Gmail in Settings." },
        { status: 401 }
      );
    }
  }

  /* ── 3. Handle Attachment ──────────────────────────────────────── */
  let attachment: { filename: string; mimeType: string; dataBase64: string } | undefined;

  const { data: profile } = await auth.admin
    .from("profiles")
    .select("full_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  const formattedName = profile?.full_name 
    ? profile.full_name.replace(/\s+/g, '').toLowerCase() 
    : "master";

  if (customFile && customFile.size > 0) {
    const arrayBuffer = await customFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = customFile.name.split('.').pop() || 'pdf';
    attachment = {
      filename: `${formattedName}_resume.${extension}`,
      mimeType: customFile.type || "application/octet-stream",
      dataBase64: buffer.toString("base64"),
    };
  } else {
    // Fetch master resume
    const { data: resume } = await auth.admin
      .from("master_resume")
      .select("resume_url")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (resume?.resume_url) {
      const { data: fileData, error: downloadError } = await auth.admin.storage
        .from("resumes")
        .download(resume.resume_url);
        
      if (!downloadError && fileData) {
        const arrayBuffer = await fileData.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        attachment = {
          filename: `${formattedName}_resume.pdf`,
          mimeType: fileData.type || "application/pdf",
          dataBase64: buffer.toString("base64"),
        };
      }
    }
  }

  /* ── 4. Send via Gmail API ─────────────────────────────────────── */
  let emailStatus = "sent";
  let emailError: string | null = null;

  try {
    await sendViaGmail({
      accessToken,
      fromEmail: tokenRow.gmail_email,
      to: hrEmail,
      subject,
      body,
      attachment,
    });
  } catch (err) {
    console.error("Gmail send error:", err);
    emailStatus = "failed";
    emailError = err instanceof Error ? err.message : "Unknown Gmail error";
  }

  /* ── 5. Update application status ──────────────────────────────── */
  const { error: updateError } = await auth.admin
    .from("applications")
    .update({
      hr_email: hrEmail,
      email_subject: subject,
      email_body: body,
      status: emailStatus === "sent" ? "Applied" : "Draft",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", auth.user.id)
    .eq("id", applicationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  /* ── 6. Log the email attempt ──────────────────────────────────── */
  await auth.admin.from("email_logs").insert({
    application_id: applicationId,
    user_id: auth.user.id,
    provider: "gmail",
    recipient: hrEmail,
    subject: subject,
    body: body,
    status: emailStatus,
    error: emailError,
  });

  if (emailStatus === "failed") {
    return NextResponse.json(
      { success: false, error: emailError },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      status: emailStatus,
      provider: "gmail",
      from: tokenRow.gmail_email,
    },
  });
}
