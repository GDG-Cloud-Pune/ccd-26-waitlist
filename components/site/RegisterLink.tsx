"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "@/components/brand/Icon";
import { trackEvent } from "@/lib/analytics";
import { visitCampaign } from "@/lib/campaign";
import { EVENT, registrationLink, type RegisterPlacement } from "@/lib/event";

// The visit's tags don't change while a page is open, so there is nothing to subscribe to.
const subscribe = () => () => {};

type RegisterLinkProps = {
  /** Where the button sits; tags the KonfHub link (utm_content) and the Analytics event. */
  placement: RegisterPlacement;
  className?: string;
  /** Defaults to the label with an arrow; pass children to draw the pill differently (the nav adds a dot). */
  children?: ReactNode;
};

/**
 * The Register button. KonfHub opens in a new tab; while registrations are closed it is a plain status pill.
 * The server renders the website-tagged link; in the browser it carries the tags the visitor arrived with.
 */
export function RegisterLink({ placement, className, children }: RegisterLinkProps) {
  const arrivedWith = useSyncExternalStore(subscribe, visitCampaign, () => "");

  if (!EVENT.registrationsOpen) {
    return <span className={className}>{EVENT.registrationClosedLabel}</span>;
  }

  return (
    <a
      href={registrationLink(placement, arrivedWith)}
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
