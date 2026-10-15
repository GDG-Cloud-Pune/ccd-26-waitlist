"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/*
 * Port of the design's ccd-motion.js to Next.js client routing:
 *  - scroll reveals for [data-reveal] elements,
 *  - parallax for [data-parallax] elements,
 *  - a fade on first load,
 *  - the brand "cloud billow" transition between pages.
 * Everything is skipped when the visitor prefers reduced motion.
 */

const CLOUD_PATH =
  "M30 70 H95 A20 20 0 0 0 95 30 A25 25 0 0 0 48 22 A18 18 0 0 0 30 34 A18 18 0 0 0 30 70 Z";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type CloudLayer = { overlay: HTMLDivElement; backdrop: HTMLDivElement; clouds: HTMLDivElement[] };

/**
 * Elements already set up to animate. Kept outside the effect because React runs
 * effects twice in development: the second pass must re-observe anything still
 * hidden rather than skip it, or those sections stay invisible.
 */
const prepared = new WeakSet<HTMLElement>();

function buildClouds(): CloudLayer {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const overlay = document.createElement("div");
  overlay.dataset.ccdCloud = "";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;";

  const backdrop = document.createElement("div");
  backdrop.style.cssText = "position:absolute;inset:0;background:#4285f4;opacity:0;";
  overlay.appendChild(backdrop);

  const clouds: HTMLDivElement[] = [];
  const base = Math.max(w * 0.62, h * 0.9, 420);
  const cloudHeight = base / 1.5;

  for (let y = -cloudHeight * 0.35, row = 0; y < h + cloudHeight * 0.1; y += cloudHeight * 0.42, row++) {
    for (let x = row % 2 ? -base * 0.55 : -base * 0.2; x < w + base * 0.1; x += base * 0.62) {
      const width = base * (0.85 + Math.random() * 0.3);
      const height = width / 1.5;
      const flip = Math.random() < 0.5;
      const el = document.createElement("div");
      el.style.cssText = `position:absolute;left:${x + (Math.random() - 0.5) * base * 0.12}px;top:${
        y + (Math.random() - 0.5) * cloudHeight * 0.12
      }px;width:${width}px;height:${height}px;opacity:0;will-change:transform,opacity;`;
      el.innerHTML = `<svg viewBox="10 0 108 72" width="100%" height="100%" style="display:block;overflow:visible"><g${
        flip ? ' transform="translate(128,0) scale(-1,1)"' : ""
      }><path d="${CLOUD_PATH}" fill="#4285f4" stroke="#f0f0f0" stroke-width="3" stroke-linejoin="round" vector-effect="non-scaling-stroke"></path></g></svg>`;
      el.dataset.y = String(Math.min(1, Math.max(0, y / h)));
      el.dataset.dir = x + width / 2 < w / 2 ? "-1" : "1";
      overlay.appendChild(el);
      clouds.push(el);
    }
  }

  document.body.appendChild(overlay);
  return { overlay, backdrop, clouds };
}

/** Clouds roll in to cover the page; `done` runs once it is fully covered. */
function cover(done: () => void): CloudLayer {
  const layer = buildClouds();
  let last = 0;
  layer.clouds.forEach((el) => {
    const delay = (1 - Number(el.dataset.y)) * 90 + Math.random() * 50;
    last = Math.max(last, delay);
    el.animate(
      [
        { transform: `translate(${Number(el.dataset.dir) * 18}vw,14vh) scale(.6)`, opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 220, delay, easing: "cubic-bezier(.2,.8,.3,1)", fill: "forwards" },
    );
  });
  layer.backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 110, delay: last + 110, fill: "forwards" });
  setTimeout(done, last + 230);

  // Safety net: if navigation never completes, don't leave the page covered.
  setTimeout(() => {
    if (layer.overlay.isConnected) uncover(layer);
  }, 4000);

  return layer;
}

/** Clouds part to reveal the page underneath, then the overlay is removed. */
function uncover(layer: CloudLayer) {
  const { overlay, backdrop, clouds } = layer;
  if (!overlay.isConnected) return;

  // Settle the cover animations first, otherwise their fill:forwards values win.
  backdrop.getAnimations().forEach((animation) => animation.cancel());
  backdrop.style.opacity = "1";
  clouds.forEach((el) => {
    el.getAnimations().forEach((animation) => animation.cancel());
    el.style.opacity = "1";
    el.style.transform = "none";
  });

  let max = 0;
  setTimeout(() => {
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" });
    clouds.forEach((el) => {
      const delay = Number(el.dataset.y) * 80 + Math.random() * 50;
      max = Math.max(max, delay);
      el.animate(
        [
          { transform: "none", opacity: 1 },
          { transform: `translate(${Number(el.dataset.dir) * 30}vw,-8vh) scale(1.1)`, opacity: 0 },
        ],
        { duration: 280, delay, easing: "cubic-bezier(.5,0,.4,1)", fill: "forwards" },
      );
    });
    setTimeout(() => overlay.remove(), max + 300);
  }, 60);
}

export function Motion() {
  const router = useRouter();
  const pathname = usePathname();
  const firstRender = useRef(true);
  const coverLayer = useRef<CloudLayer | null>(null);

  // Scroll reveals, re-scanned on every page.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "none";
          el.dataset.revealed = "";
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.dataset.revealed !== undefined) return; // already shown
        if (!prepared.has(el)) {
          prepared.add(el);
          // Anything already on screen stays as it is, so the first view never flashes.
          if (reduced || el.getBoundingClientRect().top < window.innerHeight * 0.92) {
            el.dataset.revealed = "";
            return;
          }
          el.style.opacity = "0";
          el.style.transform = "translateY(32px)";
          el.style.transition =
            "opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)";
          el.style.transitionDelay = `${el.dataset.reveal || 0}ms`;
        }
        observer.observe(el);
      });
    };

    scan();
    const timer = setTimeout(scan, 60);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  // Parallax for [data-parallax="<speed>"] elements, e.g. the hero art.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!items.length) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      const y = window.scrollY;
      items.forEach((el) => {
        el.style.transform = `translate3d(0,${(y * Number(el.dataset.parallax || 0)).toFixed(1)}px,0)`;
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      items.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, [pathname]);

  // First load: fade in, or part the clouds if we arrived from a full page load.
  useEffect(() => {
    if (!firstRender.current) return;
    firstRender.current = false;
    let cameByCloud = false;
    try {
      cameByCloud = sessionStorage.getItem("ccdCloud") === "1";
      sessionStorage.removeItem("ccdCloud");
    } catch {
      /* private mode */
    }
    if (prefersReducedMotion()) return;
    if (cameByCloud) uncover(buildCoveredLayer());
    else document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "ease-out" });
  }, []);

  // After a covered navigation, part the very clouds that covered the page.
  useEffect(() => {
    const layer = coverLayer.current;
    if (!layer) return;
    coverLayer.current = null;
    uncover(layer);
  }, [pathname]);

  const onClick = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href") || "";
      // Only same-site page links; in-page anchors and external links behave normally.
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) return;
      const url = new URL(anchor.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      event.preventDefault();

      if (prefersReducedMotion()) {
        router.push(url.pathname + url.search + url.hash);
        return;
      }

      coverLayer.current = cover(() => router.push(url.pathname + url.search + url.hash));
    },
    [router],
  );

  useEffect(() => {
    // Capture phase: next/link navigates in its own click handler, so a bubble-phase
    // listener would run after the route had already changed and never get to animate.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [onClick]);

  return null;
}

/** A layer already in its covered state, for pages entered by a full page load. */
function buildCoveredLayer(): CloudLayer {
  const layer = buildClouds();
  layer.backdrop.style.opacity = "1";
  layer.clouds.forEach((el) => {
    el.style.opacity = "1";
  });
  return layer;
}
