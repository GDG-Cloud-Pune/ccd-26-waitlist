"use client";

import { useEffect, useRef, useState } from "react";
import { isHeroHeld, markHeroReady } from "@/lib/hero-ready";
import type { HeroScene } from "@/lib/hero3d/scene";
import type { PaletteName, ViewName } from "@/lib/hero3d/wada";
import styles from "./Hero3D.module.css";

type Hero3DProps = {
  view?: ViewName;
  colors?: PaletteName;
};

export function Hero3D({ view = "low", colors = "classic" }: Hero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HeroScene | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    // three.js is ~150KB: only load it once the hero is actually near the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        import("@/lib/hero3d/scene")
          .then(({ createHeroScene }) =>
            createHeroScene(container, { view, colors, isHeld: isHeroHeld, onReady: markHeroReady }),
          )
          .then((scene) => {
            if (cancelled) {
              scene?.dispose();
              return;
            }
            if (!scene) {
              setFailed(true);
              markHeroReady();
              return;
            }
            sceneRef.current = scene;
          })
          .catch(() => {
            if (cancelled) return;
            setFailed(true);
            markHeroReady();
          });
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);

    return () => {
      cancelled = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
    // Colors are fixed per page; only the camera changes at runtime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sceneRef.current?.setView(view);
  }, [view]);

  if (failed) {
    return (
      <div className={styles.fallback}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/wada.svg" alt="Shaniwar Wada, Pune" className={styles.fallbackArt} />
      </div>
    );
  }

  return <div ref={containerRef} className={styles.canvas} aria-hidden="true" />;
}
