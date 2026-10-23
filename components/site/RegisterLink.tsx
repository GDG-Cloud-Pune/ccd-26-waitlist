"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { trackEvent } from "@/lib/analytics";
import { EVENT, registrationLink, type RegisterPlacement } from "@/lib/event";

type RegisterLinkProps = {
  /** Where the button sits; tags the KonfHub link (utm_content) and the Analytics event. */
  placement: RegisterPlacement;
  className?: string;
  /** Defaults to the label with an arrow; pass children to draw the pill differently (the nav adds a dot). */
  children?: ReactNode;
};

/** The Register button. KonfHub opens in a new tab; while registrations are closed it is a plain status pill. */
export function RegisterLink({ placement, className, children }: RegisterLinkProps) {
  if (!EVENT.registrationsOpen) {
    return <span className={className}>{EVENT.registrationClosedLabel}</span>;
  }

  return (
    <a
      href={registrationLink(placement)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent("register_click", { placement })}
    >
      {children ?? (
        <>
          {EVENT.registrationLabel} <Icon name="arrow-right" />
        </>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
