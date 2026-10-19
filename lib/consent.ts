/** Where a visitor's analytics choice is kept, on their device only. */
export const CONSENT_KEY = "ccdAnalyticsConsent";
/** Fired by the footer's "Cookie settings" link to bring the notice back. */
export const CONSENT_OPEN_EVENT = "ccd:consent-open";

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null; // storage blocked: ask again each visit
  }
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
}
