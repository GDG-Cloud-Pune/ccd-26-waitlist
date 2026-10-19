"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_OPEN_EVENT, readConsent, saveConsent, type Consent } from "@/lib/consent";
import styles from "./Analytics.module.css";

type AnalyticsProps = {
  /** Decided on the server: only Vercel's production deployment reports to Analytics. */
  enabled: boolean;
  measurementId: string;
};

/**
 * Google Analytics 4 behind a consent notice. Nothing loads and no cookies are set until the
 * visitor accepts. Page views on client-side navigation come from GA4's enhanced measurement.
 */
export function Analytics({ enabled, measurementId }: AnalyticsProps) {
  // undefined: not read yet (server render and first client render match), null: not decided.
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const stored = readConsent();
    // Deliberate: the choice lives in localStorage, which only exists on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(stored);
    setOpen(stored === null);

    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, [enabled]);

  if (!enabled) return null;

  const choose = (value: Consent) => {
    saveConsent(value);
    setConsent(value);
    setOpen(false);
    // Turning it off after accepting: stop the already-loaded tag from sending anything more.
    (window as unknown as Record<string, boolean>)[`ga-disable-${measurementId}`] = value === "denied";
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
          </Script>
        </>
      )}

      {open && (
        <section className={styles.notice} aria-label="Cookie consent">
          <p className={styles.text}>We use cookies to improve your experience.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.accept} onClick={() => choose("granted")}>
              Accept
            </button>
            <button type="button" className={styles.decline} onClick={() => choose("denied")}>
              Decline
            </button>
          </div>
        </section>
      )}
    </>
  );
}
