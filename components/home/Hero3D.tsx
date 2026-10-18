"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { isHeroHeld, markHeroReady } from "@/lib/hero-ready";
import { boxWithin } from "@/lib/layout-box";
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
  /** Set when WebGL is unavailable: where to place the flat drawing instead. */
  const [fallback, setFallback] = useState<CSSProperties | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    // The canvas spans the whole hero; the Wada is framed within this element.
    const focus = container.closest("section")?.querySelector<HTMLElement>("[data-hero-focus]") ?? null;
    const fail = () => {
      const box = focus ? boxWithin(focus, container) : null;
      setFallback(box ? { left: box.x, top: box.y, width: box.width, height: box.height } : {});
      markHeroReady();
    };
    // three.js is ~150KB: only load it once the hero is actually near the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        import("@/lib/hero3d/scene")
          .then(({ createHeroScene }) =>
            createHeroScene(container, {
              view,
              colors,
              focus,
              isHeld: isHeroHeld,
              onReady: markHeroReady,
            }),
          )
          .then((scene) => {
            if (cancelled) {
              scene?.dispose();
              return;
            }
            if (!scene) {
              fail();
              return;
            }
            sceneRef.current = scene;
          })
          .catch(() => {
            if (cancelled) return;
            fail();
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

  if (fallback) {
    return (
      <div className={styles.fallback} style={fallback}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/wada.svg" alt="Shaniwar Wada, Pune" className={styles.fallbackArt} />
      </div>
    );
  }

  return <div ref={containerRef} className={styles.canvas} aria-hidden="true" />;
}
