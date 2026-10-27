"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RegisterLink } from "@/components/site/RegisterLink";
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
            <Image
              src="/gdg-cloud-pune-logo.png"
              alt=""
              width={1692}
              height={203}
              // Matches the CSS heights below (22px / 19px tall at 8.33:1).
              sizes="(max-width: 899px) 160px, 184px"
              priority
              className={styles.logo}
            />
          </Link>

          <div className={styles.links}>
            {NAV_LINKS.map(({ key, label, href }) => (
              <Link key={key} href={href} className={styles.link} data-active={isActive(href) ? "" : undefined}>
                {label}
              </Link>
            ))}
          </div>

          <RegisterLink placement="nav" className={styles.cta}>
            <span className={styles.ctaDot} aria-hidden="true" />
            {EVENT.registrationLabel}
          </RegisterLink>

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
        {/* Opens in a new tab, so the sheet stays as it was when the visitor comes back. */}
        {open && (
          <RegisterLink placement="menu" className={styles.sheetCta}>
            {EVENT.registrationLabel}
          </RegisterLink>
        )}
      </div>
    </>
  );
}
