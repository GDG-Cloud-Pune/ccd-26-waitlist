"use client";

import { useEffect, useRef, useState } from "react";
import { SpeakerCard } from "@/components/site/SpeakerCard";
import type { Speaker } from "@/data/speakers";
import styles from "./SpeakersGrid.module.css";

const FILTERS = ["All", "Main Stage", "Workshops"] as const;
type Filter = (typeof FILTERS)[number];

export function SpeakersGrid({ speakers }: { speakers: Speaker[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [shown, setShown] = useState<Filter>("All");
  const [fading, setFading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const choose = (next: Filter) => {
    if (next === filter) return;
    setFilter(next);
    setFading(true);
    clearTimeout(timer.current);
    // Fade the grid out, swap the list, fade back in — as in the design.
    timer.current = setTimeout(() => {
      setShown(next);
      setFading(false);
    }, 280);
  };

  const visible = shown === "All" ? speakers : speakers.filter((s) => s.track === shown);

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.filters} role="group" aria-label="Filter speakers by track">
          {FILTERS.map((label) => (
            <button
              key={label}
              type="button"
              className={styles.filter}
              data-active={filter === label ? "" : undefined}
              aria-pressed={filter === label}
              onClick={() => choose(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.grid} data-fading={fading ? "" : undefined}>
          {visible.map((speaker, i) => (
            <SpeakerCard key={speaker.id} speaker={speaker} delay={(i % 4) * 80} height={460} showSocials />
          ))}
        </div>
      </section>
    </>
  );
}
