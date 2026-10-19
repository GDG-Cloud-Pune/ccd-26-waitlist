"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/** Reopens the analytics consent notice so a visitor can change their choice. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
