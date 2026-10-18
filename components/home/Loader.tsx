"use client";

import { useEffect, useRef, useState } from "react";
import { isHeroReady, onHeroReady, setHeroHold } from "@/lib/hero-ready";
import styles from "./Loader.module.css";

const SEGMENT_COLORS = ["var(--blue)", "var(--green)", "var(--yellow)", "var(--red)"];
/** Never hold the page longer than this for the 3D Wada; it rises in on its own once ready. */
const MAX_WAIT_MS = 2500;

/** First-visit loading screen from the design: counts up, waits for the 3D hero, then lifts away. */
export function Loader() {
  const [phase, setPhase] = useState<"off" | "on" | "out">("off");
  const [pct, setPct] = useState(0);
  const heroReady = useRef(false);

  useEffect(() => {
    let show = false;
    try {
      show =
        !sessionStorage.getItem("ccdLoaded") &&
        sessionStorage.getItem("ccdCloud") !== "1" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      /* private mode */
    }
    if (!show) return;

    setHeroHold(true);
    // Deliberate: the loader only exists after mount, since whether to show it
    // depends on sessionStorage and the visitor's reduced-motion setting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase("on");
    document.documentElement.style.overflow = "hidden";

    heroReady.current = isHeroReady();
    const stopWaiting = onHeroReady(() => {
      heroReady.current = true;
    });

    const start = performance.now();
    let raf = 0;
    let outTimer: ReturnType<typeof setTimeout>;
    let offTimer: ReturnType<typeof setTimeout>;

    const step = () => {
      const elapsed = performance.now() - start;
      const canFinish = heroReady.current || elapsed > MAX_WAIT_MS;
      let next = Math.round(100 * (1 - Math.pow(1 - Math.min(1, elapsed / 2200), 2)));
      if (!canFinish) next = Math.min(next, 94);
      setPct(next);

      if (next >= 100) {
        try {
          sessionStorage.setItem("ccdLoaded", "1");
        } catch {
          /* private mode */
        }
        outTimer = setTimeout(() => {
          setPhase("out");
          setHeroHold(false);
          offTimer = setTimeout(() => {
            setPhase("off");
            document.documentElement.style.overflow = "";
          }, 950);
        }, 250);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(outTimer);
      clearTimeout(offTimer);
      stopWaiting();
      setHeroHold(false);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (phase === "off") return null;

  const label = pct < 45 ? "Raising the Wada" : pct < 94 ? "Rolling in the cloud" : "Ready";

  return (
    <div className={styles.loader} data-out={phase === "out" ? "" : undefined} role="status" aria-live="polite">
      <div className={styles.inner}>
        <div className={styles.pills}>
          <span className={styles.pill}>Cloud Community Day</span>
          <span className={styles.pillSolid}>2026 · Pune</span>
        </div>
        <div className={styles.readout}>
          <div className={styles.pct}>{pct}</div>
          <div className={styles.label}>{label}</div>
        </div>
        <div className={styles.segments}>
          {SEGMENT_COLORS.map((color, i) => (
            <div key={color} className={styles.segment}>
              <div
                className={styles.fill}
                style={{ width: `${Math.max(0, Math.min(1, (pct - i * 25) / 25)) * 100}%`, background: color }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
