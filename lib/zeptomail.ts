import "server-only";
import { getEnv } from "./env";

export type InlineImage = {
  /** Referenced from the HTML as src="cid:<cid>". */
  cid: string;
  mimeType: string;
  /** Base64-encoded file content. */
  content: string;
};

type SendEmailOptions = {
  to: { address: string; name: string };
  subject: string;
  html: string;
  text: string;
  inlineImages?: InlineImage[];
};

// https://www.zoho.com/zeptomail/help/api/email-sending.html
export async function sendEmail({ to, subject, html, text, inlineImages }: SendEmailOptions): Promise<void> {
  const env = getEnv();
  // Accept the token with or without the "Zoho-enczapikey" prefix copied from the dashboard
  // (with or without the space after it).
  const token = env.ZEPTOMAIL_API_KEY.trim().replace(/^Zoho-enczapikey\s*/i, "");

  const response = await fetch(env.ZEPTOMAIL_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Zoho-enczapikey ${token}`,
    },
    body: JSON.stringify({
      from: { address: env.ZEPTOMAIL_FROM_ADDRESS, name: env.ZEPTOMAIL_FROM_NAME },
      to: [{ email_address: to }],
      subject,
      htmlbody: html,
      textbody: text,
      ...(inlineImages?.length && {
        inline_images: inlineImages.map(({ cid, mimeType, content }) => ({ cid, mime_type: mimeType, content })),
      }),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`ZeptoMail responded with ${response.status}: ${body.slice(0, 500)}`);
  }
}
