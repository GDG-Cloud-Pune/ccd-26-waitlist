# Cloud Community Day Pune — Waitlist

A coming-soon page for Cloud Community Day Pune 2026 by GDG Cloud Pune, based on artboard **3a** of the Cloud Community Day brand. Visitors join the waitlist with their first name, last name, email and WhatsApp number (India, +91).

- **Next.js (App Router, TypeScript)**, deployed on **Vercel**
- **Firestore** for storage, written **only** by the server through the Firebase Admin SDK
- **ZeptoMail (India)** for the confirmation email
- The same **zod** validation runs in the browser and on the server

## How it works

`POST /api/waitlist` ([app/api/waitlist/route.ts](app/api/waitlist/route.ts)):

1. Validates the request (names, email, 10-digit Indian mobile number starting with 6–9) and returns **400** with an error for each bad field
2. Rate limits each IP address to 5 attempts per 10 minutes and returns **429** after that
3. In one Firestore transaction, rejects duplicates by email **or** WhatsApp number (**409**) and saves the entry
4. Sends the confirmation email. If sending fails, the sign-up is still kept, and `emailStatus` records what happened
5. Returns **201**

### Firestore collections

| Collection | Doc ID | Contents |
| --- | --- | --- |
| `waitlist` | auto | `firstName`, `lastName`, `email` (lowercased), `whatsapp` (`+91XXXXXXXXXX`), `source` (UTM tags, referrer, path), `createdAt`, `emailStatus` (`pending` / `sent` / `failed`) |
| `waitlistEmails` | sha256(email) | `entryId`, `createdAt`: lookup doc that enforces unique emails |
| `waitlistPhones` | sha256(whatsapp) | `entryId`, `createdAt`: lookup doc that enforces unique numbers |
| `rateLimits` | sha256(salt + IP) | `count`, `windowStart`, `expiresAt` |

## Local setup

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open http://localhost:3000.

## Environment variables

All of them are **server-only**. Never prefix them with `NEXT_PUBLIC_`, or they end up in the browser bundle. See [.env.example](.env.example).

| Variable | Where to get it |
| --- | --- |
| `FIREBASE_PROJECT_ID` | Firebase console → Project settings → Service accounts → **Generate new private key** → `project_id` |
| `FIREBASE_CLIENT_EMAIL` | same JSON → `client_email` |
| `FIREBASE_PRIVATE_KEY` | same JSON → `private_key` (keep the quotes and the `\n` sequences) |
| `ZEPTOMAIL_API_URL` | `https://api.zeptomail.in/v1.1/email` |
| `ZEPTOMAIL_API_KEY` | ZeptoMail → Mail Agents → SMTP/API → **Send Mail token** |
| `ZEPTOMAIL_FROM_ADDRESS` | an address on a domain verified in ZeptoMail |
| `ZEPTOMAIL_FROM_NAME` | e.g. `GDG Cloud Pune` |
| `RATE_LIMIT_SALT` | `openssl rand -hex 32` |

Delete the downloaded service-account JSON once the values are in `.env.local` and Vercel.

## One-time Firebase and ZeptoMail steps

1. **Firestore rules:** publish [firestore.rules](firestore.rules). It denies all browser access; the Admin SDK isn't affected. Use the console (Firestore → Rules) or `firebase deploy --only firestore:rules`.
2. **TTL policy:** Firestore → TTL policies → collection group `rateLimits`, timestamp field `expiresAt`.
3. **ZeptoMail:** verify your sending domain and create a Send Mail token for the Mail Agent.

## Deploying to Vercel

1. Import the repository in Vercel (framework: Next.js).
2. Project → Settings → Environment Variables: add every variable above for **Production** and **Preview**. Paste `FIREBASE_PRIVATE_KEY` exactly as it appears in the JSON.
3. Deploy.

## Scripts

- `npm run dev`: start the dev server
- `npm run build`: production build
- `npm run lint`: run ESLint
- `node scripts/render-email-header.mjs`: re-render the confirmation email's header image (needs Google Chrome). Run it after changing the email header design; it regenerates `lib/emails/header-image.ts`.

## Confirmation email and dark mode

Gmail on iPhone and iPad flips the colors of emails in dark mode, and most email apps don't load web fonts. The email in [lib/emails/waitlist-confirmation.ts](lib/emails/waitlist-confirmation.ts) is built to survive both:

- **Header image:** the logo, wordmark, color bar, pills and "You're on the list!" are one PNG attached inside the email (ZeptoMail `inline_images`). Images keep their colors and fonts in every app.
- **Backgrounds:** each one is also painted as a single-color `linear-gradient`, which Gmail on iPhone doesn't recolor.
- **Text:** white text sits inside the `gmail-blend-screen` / `gmail-blend-difference` layers, which undo Gmail's flipping ([technique](https://www.hteumeuleu.com/2021/fixing-gmail-dark-mode-css-blend-modes/)). This only works for white text, so keep new copy white and put any colored elements in the header image.
