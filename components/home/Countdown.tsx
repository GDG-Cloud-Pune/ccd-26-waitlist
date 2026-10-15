"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/lib/event";
import styles from "./Countdown.module.css";

const TARGET = Date.parse(EVENT.startsAt);

function parts(now: number) {
  const ms = Math.max(0, TARGET - now);
  return [
    { value: Math.floor(ms / 864e5), label: "Days" },
    { value: Math.floor(ms / 36e5) % 24, label: "Hours" },
    { value: Math.floor(ms / 6e4) % 60, label: "Mins" },
    { value: Math.floor(ms / 1e3) % 60, label: "Secs" },
  ];
}

export function Countdown() {
  // Starts blank so the server and the first client render agree, then ticks every second.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Deliberate: the clock can only start on the client, so the server and the
    // first client render both show placeholders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const values = parts(now ?? TARGET);

  return (
    <div className={styles.row} aria-label={`Countdown to ${EVENT.dateLong}`}>
      {values.map(({ value, label }) => (
        <div key={label} className={styles.cell}>
          <span className={styles.value}>{now === null ? "––" : String(value).padStart(2, "0")}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
