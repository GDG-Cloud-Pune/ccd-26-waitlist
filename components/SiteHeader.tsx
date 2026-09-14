"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SiteHeaderProps = {
  className?: string;
  children: ReactNode;
};

// Sticky navbar; `data-scrolled` lets CSS show a divider only once the page has scrolled.
export function SiteHeader({ className, children }: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const update = () => {
      header.dataset.scrolled = window.scrollY > 4 ? "true" : "false";
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header ref={headerRef} className={className} data-scrolled="false">
      {children}
    </header>
  );
}
