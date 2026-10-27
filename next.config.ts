import type { NextConfig } from "next";
import { registrationLink, SHORT_LINKS, shortLinkDestination } from "./lib/event";

const isDev = process.env.NODE_ENV !== "production";

// Fonts are self-hosted by next/font and the site makes no requests of its own.
// Third parties: YouTube's privacy-enhanced player (framed after a visitor presses play) and
// Google Analytics 4, which loads from googletagmanager.com and reports to google-analytics.com.
// Next.js injects inline hydration scripts, so script-src needs 'unsafe-inline' without nonces.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self'",
  "frame-src https://www.youtube-nocookie.com",
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // The waitlist link that was shared before registrations opened now lands on the ticket page.
      { source: "/waitlist", destination: registrationLink("waitlist-link"), permanent: false },
      // Short links for each platform land on the home page with that platform's UTM tags.
      ...SHORT_LINKS.map((link) => ({ source: link.path, destination: shortLinkDestination(link), permanent: false })),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
