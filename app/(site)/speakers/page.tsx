import type { Metadata } from "next";
import { SpeakersGrid } from "@/components/speakers/SpeakersGrid";
import { SPEAKERS } from "@/data/speakers";
import { EVENT } from "@/lib/event";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Speakers",
  description: `Speakers at ${EVENT.name} ${EVENT.year} — practitioners from across the Google Cloud and AI community.`,
};

export default function SpeakersPage() {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.pills}>
            <span className={styles.pill}>Speakers</span>
            <span className={styles.pillSolid}>{EVENT.dateShort}</span>
          </div>
          <h1 className={styles.title}>
            The people <span className={styles.blue}>building</span> it.
          </h1>
          <p className={styles.lede}>
            Practitioners from across the Google Cloud and AI community. Tap a card to see what they&rsquo;re talking
            about.
          </p>
        </div>
      </section>

      <SpeakersGrid speakers={SPEAKERS} />

      <section className={styles.ctaSection}>
        <div data-reveal="0" className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Want to be on this page?</h2>
          <span className={styles.darkPill}>
            <span className={styles.dot} aria-hidden="true" />
            Call for speakers opening soon
          </span>
        </div>
      </section>
    </>
  );
}
