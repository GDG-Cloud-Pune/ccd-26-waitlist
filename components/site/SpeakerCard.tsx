"use client";

import { useState } from "react";
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
  showSocials?: boolean;
};

export function SpeakerCard({ speaker, delay = 0, height = 440, showSocials = false }: SpeakerCardProps) {
  const [flipped, setFlipped] = useState(false);
  const trackColor = TRACKS[speaker.track].color;

  return (
    <div data-reveal={delay} className={styles.scene} style={{ height }}>
      <button
        type="button"
        className={styles.inner}
        data-flipped={flipped ? "" : undefined}
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label={`${speaker.name} — ${flipped ? "show photo" : "show talk details"}`}
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
                ↻
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
            {showSocials && (
              <div className={styles.backSocials} aria-hidden="true">
                <span className={styles.socialDot} />
                <span className={styles.socialDot} />
              </div>
            )}
          </div>
        </div>
      </button>
    </div>
  );
}
