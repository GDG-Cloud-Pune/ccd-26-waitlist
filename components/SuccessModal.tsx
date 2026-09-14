"use client";

import { useEffect, useRef } from "react";
import { CloudMark } from "@/components/brand/CloudMark";
import { ColorBar } from "@/components/brand/ColorBar";
import { SocialLinks } from "@/components/SocialLinks";
import styles from "./SuccessModal.module.css";

type SuccessModalProps = {
  open: boolean;
  firstName: string;
  emailSent: boolean;
  onClose: () => void;
};

// Native <dialog> via showModal(): focus trapping, Esc to close and an inert background come for free.
export function SuccessModal({ open, firstName, emailSent, onClose }: SuccessModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="success-title"
      aria-describedby="success-text"
      onClose={onClose}
      // The dialog box is the card itself, so a click whose target is the dialog landed on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className={styles.card}>
        <button type="button" className={styles.close} aria-label="Close" onClick={close}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
          </svg>
        </button>

        <CloudMark className={styles.cloud} />
        <h2 id="success-title" className={styles.title}>
          You&rsquo;re on the list, {firstName}!
        </h2>
        <p id="success-text" className={styles.text}>
          {emailSent ? "We've sent a confirmation to your inbox. " : ""}
          We&rsquo;ll let you know as soon as registrations open.
        </p>

        <ColorBar className={styles.bar} />

        <p className={styles.followTitle}>Follow us on social media for updates</p>
        <SocialLinks />

        <button type="button" className={styles.done} onClick={close}>
          Done
        </button>
      </div>
    </dialog>
  );
}
