"use client";

import { useState } from "react";
import { Icon } from "@/components/brand/Icon";
import { SocialIcon } from "@/components/brand/SocialIcon";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import type { Speaker } from "@/data/speakers";
import { TRACKS } from "@/lib/event";
import styles from "./SpeakerCard.module.css";

type SpeakerCardProps = {
  speaker: Speaker;
  /** Staggers the scroll reveal, in ms. */
  delay?: number;
  /** Taller cards on the speakers page than in the home preview. */
  height?: number;
  /** Shows the speaker's LinkedIn / X links on the back, where they have them. */
  showSocials?: boolean;
};

export function SpeakerCard({ speaker, delay = 0, height = 440, showSocials = false }: SpeakerCardProps) {
  const [flipped, setFlipped] = useState(false);
  const trackColor = TRACKS[speaker.track].color;
  const socials = showSocials
    ? [
        speaker.linkedin && { name: "LinkedIn", href: speaker.linkedin, icon: "linkedin" as const },
        speaker.x && { name: "X", href: speaker.x, icon: "x" as const },
      ].filter((s): s is { name: string; href: string; icon: "linkedin" | "x" } => Boolean(s))
    : [];

  return (
    <div data-reveal={delay} className={styles.scene} style={{ height }}>
      <button
        type="button"
        className={styles.inner}
        data-flipped={flipped ? "" : undefined}
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${speaker.name}: ${flipped ? "show photo" : "show talk details"}`}
      >
        <div className={styles.front}>
          <div className={styles.photo}>
            <PhotoSlot src={speaker.photo} alt={speaker.name} label="Speaker photo" sizes="(max-width: 900px) 100vw, 280px" />
          </div>
          <div className={styles.frontBody}>
            <div className={styles.frontTop}>
              <span className={styles.track} style={{ background: trackColor }}>
                {speaker.track}
              </span>
              <span className={styles.flipHint} aria-hidden="true">
                <Icon name="flip" size={14} />
              </span>
            </div>
            <div className={styles.name}>{speaker.name}</div>
            <div className={styles.role}>{speaker.role}</div>
          </div>
        </div>

        <div className={styles.back} style={{ background: trackColor }}>
          <span className={styles.backTrack}>{speaker.track}</span>
          <div className={styles.talk}>{speaker.talk}</div>
          <div className={styles.abstract}>{speaker.abstract}</div>
          <div className={styles.backFooter}>
            <div className={styles.backMeta}>
              <span className={styles.backName}>{speaker.name}</span>
              <span className={styles.time}>{speaker.time}</span>
            </div>
          </div>
        </div>
      </button>

      {/* Links can't live inside the flip button, so they sit over the back's footer once it's showing. */}
      {socials.length > 0 && (
        <div className={styles.backLinks} data-shown={flipped ? "" : undefined}>
          {socials.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.backLink}
              aria-label={`${speaker.name} on ${name} (opens in a new tab)`}
              tabIndex={flipped ? undefined : -1}
            >
              <SocialIcon name={icon} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
