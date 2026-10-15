"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EVENT, NAV_LINKS } from "@/lib/event";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();
  // Remembering which page the sheet was opened on closes it automatically after navigating.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <div className={styles.wrap}>
        <nav className={styles.bar} aria-label="Main">
          <Link href="/" className={styles.brand} aria-label={`${EVENT.name} home`}>
            <svg viewBox="0 0 120 80" width="48" height="32" aria-hidden="true" focusable="false">
              <path
                d="M30 70 H95 A20 20 0 0 0 95 30 A25 25 0 0 0 48 22 A18 18 0 0 0 30 34 A18 18 0 0 0 30 70 Z"
                fill="var(--blue)"
                stroke="var(--off-white)"
                strokeWidth={5}
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.brandName}>{EVENT.name}</span>
          </Link>

          <div className={styles.links}>
            {NAV_LINKS.map(({ key, label, href }) => (
              <Link key={key} href={href} className={styles.link} data-active={isActive(href) ? "" : undefined}>
                {label}
              </Link>
            ))}
          </div>

          <span className={styles.cta}>
            <span className={styles.ctaDot} aria-hidden="true" />
            {EVENT.registrationLabel}
          </span>

          <button
            type="button"
            className={styles.burger}
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen(!open)}
          >
            <span className={styles.burgerBar} data-open={open ? "" : undefined} />
            <span className={styles.burgerBar} data-open={open ? "" : undefined} />
          </button>
        </nav>
      </div>

      <div id="nav-sheet" className={styles.sheet} data-open={open ? "" : undefined} aria-hidden={!open}>
        {NAV_LINKS.map(({ key, label, href }) => (
          <Link key={key} href={href} className={styles.sheetLink} tabIndex={open ? undefined : -1}>
            {label}
          </Link>
        ))}
        <span className={styles.sheetCta}>{EVENT.registrationLabel}</span>
      </div>
    </>
  );
}
