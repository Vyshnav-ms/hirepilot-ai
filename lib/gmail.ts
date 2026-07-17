import { google } from "googleapis";

/** Build an authenticated OAuth2 client from stored tokens */
export function getOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "";
  const redirectUri = `${baseUrl}/api/auth/gmail/callback`;

  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set.");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/** Generate the Google OAuth consent URL, embedding userId in state */
export function getAuthUrl(userId: string): string {
  const oAuth2Client = getOAuthClient();
  return oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // always get refresh_token
    state: userId,     // passed back to callback so we know who's connecting
    scope: [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

/** Exchange authorization code for tokens */
export async function exchangeCodeForTokens(code: string) {
  const oAuth2Client = getOAuthClient();
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens;
}

/** Refresh an expired access token using the stored refresh token */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expiry_date: number;
}> {
  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oAuth2Client.refreshAccessToken();

  if (!credentials.access_token) {
    throw new Error("Failed to refresh Gmail access token.");
  }

  return {
    access_token: credentials.access_token,
    expiry_date: credentials.expiry_date ?? Date.now() + 3600 * 1000,
  };
}

/** Build a base64url-encoded RFC 2822 MIME message */
function buildMimeMessage({
  from,
  to,
  subject,
  body,
  attachment,
}: {
  from: string;
  to: string;
  subject: string;
  body: string;
  attachment?: {
    filename: string;
    mimeType: string;
    dataBase64: string;
  };
}): string {
  const boundary = `----=_Part_${Math.random().toString(36).substring(2)}`;
  const htmlBody = body.replace(/\n/g, "<br>");
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    htmlBody,
  ];

  if (attachment) {
    emailLines.push(
      "",
      `--${boundary}`,
      `Content-Type: ${attachment.mimeType}; name="${attachment.filename}"`,
      `Content-Disposition: attachment; filename="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      "",
      attachment.dataBase64
    );
  }

  emailLines.push("", `--${boundary}--`);

  const email = emailLines.join("\r\n");
  // base64url encode (no padding, + → -, / → _)
  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Send an email via Gmail API on behalf of the user */
export async function sendViaGmail({
  accessToken,
  fromEmail,
  to,
  subject,
  body,
  attachment,
}: {
  accessToken: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  attachment?: {
    filename: string;
    mimeType: string;
    dataBase64: string;
  };
}): Promise<void> {
  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const raw = buildMimeMessage({ from: fromEmail, to, subject, body, attachment });

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}

/** Get the Gmail email address for the authenticated user */
export async function getGmailUserEmail(accessToken: string): Promise<string> {
  const oAuth2Client = getOAuthClient();
  oAuth2Client.setCredentials({ access_token: accessToken });

  const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.email) throw new Error("Could not retrieve Gmail email address.");
  return data.email;
}
