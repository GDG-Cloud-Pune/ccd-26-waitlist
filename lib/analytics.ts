/** Google Analytics 4 web stream for ccd.gdgcloudpune.in (Firebase project gdgcpune). Public by design. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-S9XG9SLMEM";

/**
 * Only Vercel's production deployment reports to Analytics, so local runs and preview links
 * don't add test traffic. Read at build time, when VERCEL_ENV is available.
 */
export const ANALYTICS_ENABLED = process.env.VERCEL_ENV === "production";

type Gtag = (command: "event", name: string, params?: Record<string, unknown>) => void;

/** Sends a GA4 event; does nothing where the tag isn't loaded (local, previews, blockers). */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  const gtag = (window as typeof window & { gtag?: Gtag }).gtag;
  gtag?.("event", name, params);
}
