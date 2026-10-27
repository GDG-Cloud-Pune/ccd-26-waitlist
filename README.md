# Cloud Community Day Pune 2026

The event site for Cloud Community Day Pune 2026 by GDG Cloud Pune: home page with the 3D Shaniwar Wada hero, agenda, and (once switched on) speakers and team pages. Registrations are handled on [KonfHub](https://konfhub.com/ccdpune); every Register button links there with UTM tags so KonfHub attributes sign-ups to this site.

- **Next.js (App Router, TypeScript)**, deployed on **Vercel**
- **three.js** for the hero, loaded only when the hero is near the viewport
- **Google Analytics 4** on the production deployment only (see [lib/analytics.ts](lib/analytics.ts))
- No backend: the site is static apart from the redirect below

## Content and switches

Everything about the event lives in [lib/event.ts](lib/event.ts): dates, venue, links, which pages are live, and the registration link.

| Switch | What it does |
| --- | --- |
| `agendaPublished` | Shows the Agenda page, its nav link and the links to it from the home page |
| `speakersAnnounced` | Shows the Speakers page, its nav link and the preview on the home page |
| `teamPublished` | Shows the Team page and its nav link |
| `registrationsOpen` | `false` turns every Register button into a plain "Registrations closed" status |

Pages that are switched off answer 404 and stay out of the sitemap. The agenda, speakers, team and home-page sections read their content from [data/](data/).

`registrationLink(placement)` builds the KonfHub URL with `utm_source=website`, `utm_medium=referral`, `utm_campaign=ccd-pune-2026` and `utm_content=<placement>` (nav, hero, register section, 404, and the old `/waitlist` link, which now redirects there). Clicks also send a `register_click` event to Analytics with the same placement.

## Local setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. No environment variables are needed; see [.env.example](.env.example) for the optional ones.

## Scripts

- `node scripts/render-og-image.mjs` renders the link-preview image to `public/og-image.png`. Needs Google Chrome; re-run after changing the date, venue or design.

## Deploying to Vercel

Push to `main`. Nothing to configure beyond the optional variables in [.env.example](.env.example).
