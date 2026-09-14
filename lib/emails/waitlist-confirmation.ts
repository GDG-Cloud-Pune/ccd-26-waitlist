import "server-only";
import {
  EMAIL_HEADER_CID,
  EMAIL_HEADER_HEIGHT,
  EMAIL_HEADER_PNG_BASE64,
  EMAIL_HEADER_WIDTH,
} from "@/lib/emails/header-image";
import { SOCIAL_LINKS } from "@/lib/socials";
import type { InlineImage } from "@/lib/zeptomail";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/*
 * Dark email that survives Gmail iOS dark mode (which inverts colors) — see
 * https://www.hteumeuleu.com/2021/fixing-gmail-dark-mode-css-blend-modes/
 * - Every background is also painted as a one-colour linear-gradient, which Gmail iOS leaves alone.
 * - Text sits inside .gmail-blend-screen > .gmail-blend-difference, which cancels the inversion.
 *   That only works for white text, so copy is white and all brand colour lives in the header image.
 * - The card outline is a padded outer table, since CSS borders get recoloured.
 * - Web fonts only load in Apple Mail and a few others; everywhere else the system stack is used,
 *   which is why the branded type is part of the header image.
 */
const PAGE = "#121212";
const CARD = "#1e1e1e";
const OUTLINE = "#f0f0f0";
const RULE = "#3a3a3a";
const WHITE = "#ffffff";
const FONT = "Outfit,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const solid = (color: string) => `background-color:${color};background-image:linear-gradient(${color},${color});`;
const whiteText = (html: string) =>
  `<div class="gmail-blend-screen"><div class="gmail-blend-difference">${html}</div></div>`;

export function waitlistConfirmationEmail({ firstName }: { firstName: string }): {
  subject: string;
  html: string;
  text: string;
  inlineImages: InlineImage[];
} {
  const subject = "You're on the Cloud Community Day Pune waitlist";
  const name = escapeHtml(firstName);

  const socials = SOCIAL_LINKS.map(
    ({ name: network, href }) =>
      `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:${WHITE};font-weight:600;text-decoration:underline;">${network}</a>`,
  ).join("&nbsp;&nbsp;&middot;&nbsp;&nbsp;");

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>${subject}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&amp;display=swap" rel="stylesheet">
    <style>
      u + .body .gmail-blend-screen { background:#000; mix-blend-mode:screen; }
      u + .body .gmail-blend-difference { background:#000; mix-blend-mode:difference; }
    </style>
  </head>
  <body class="body" style="margin:0;padding:0;${solid(PAGE)}color:${WHITE};font-family:${FONT};">
    <div style="${solid(PAGE)}color:${WHITE};padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;${solid(OUTLINE)}border-radius:24px;">
        <tr>
          <td style="padding:3px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${solid(CARD)}border-radius:21px;">
              <tr>
                <td style="padding:32px 36px 0;">
                  <img src="cid:${EMAIL_HEADER_CID}" width="${EMAIL_HEADER_WIDTH}" height="${EMAIL_HEADER_HEIGHT}" alt="Cloud Community Day Pune 2026 &mdash; You&rsquo;re on the list!" style="display:block;width:100%;max-width:${EMAIL_HEADER_WIDTH}px;height:auto;border:0;">
                </td>
              </tr>
              <tr>
                <td style="padding:24px 36px 28px;font-family:${FONT};font-size:17px;line-height:1.55;color:${WHITE};">
                  ${whiteText(`<p style="margin:0 0 16px;">Hi ${name},</p>
                  <p style="margin:0 0 16px;">You&rsquo;re on the waitlist for <strong>Cloud Community Day Pune 2026</strong>. We&rsquo;ll let you know as soon as registrations open, along with speaker and agenda updates.</p>
                  <p style="margin:0;">See you soon,<br><strong>GDG Cloud Pune</strong></p>`)}
                </td>
              </tr>
              <tr>
                <td style="padding:0 36px;">
                  <div style="height:2px;${solid(RULE)}font-size:0;line-height:0;">&nbsp;</div>
                </td>
              </tr>
              <tr>
                <td style="padding:22px 36px 32px;font-family:${FONT};font-size:16px;line-height:1.6;color:${WHITE};">
                  ${whiteText(`<div style="margin:0 0 6px;font-weight:600;">Follow us on social media for updates</div>
                  <div>${socials}</div>`)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <div style="max-width:560px;margin:16px auto 0;text-align:center;font-family:${FONT};font-size:12px;line-height:1.5;color:${WHITE};">
        ${whiteText("You&rsquo;re receiving this because you joined the Cloud Community Day Pune waitlist.")}
      </div>
    </div>
  </body>
</html>`;

  const text = `Hi ${firstName},

You're on the waitlist for Cloud Community Day Pune 2026. We'll let you know as soon as registrations open, along with speaker and agenda updates.

See you soon,
GDG Cloud Pune

Follow us on social media for updates:
${SOCIAL_LINKS.map(({ name: network, href }) => `${network}: ${href}`).join("\n")}

You're receiving this because you joined the Cloud Community Day Pune waitlist.`;

  return {
    subject,
    html,
    text,
    inlineImages: [{ cid: EMAIL_HEADER_CID, mimeType: "image/png", content: EMAIL_HEADER_PNG_BASE64 }],
  };
}
