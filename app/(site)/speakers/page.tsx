import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpeakersGrid } from "@/components/speakers/SpeakersGrid";
import { SPEAKERS } from "@/data/speakers";
import { EVENT } from "@/lib/event";
import { sharePreview } from "@/lib/site";
import styles from "./page.module.css";

const description = `Speakers at ${EVENT.name} ${EVENT.year}: practitioners from across the Google Cloud and AI community.`;

/** While the page is switched off it answers 404, so the tab shouldn't be titled as if it were live. */
const notFoundMetadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export function generateMetadata(): Metadata {
  if (!EVENT.speakersAnnounced) return notFoundMetadata;
  return {
    title: "Speakers",
    description,
    alternates: { canonical: "/speakers" },
    ...sharePreview(`Speakers · ${EVENT.name} ${EVENT.year}`, description, "/speakers"),
  };
}

export default function SpeakersPage() {
  // Hidden until the line-up is final: flip EVENT.speakersAnnounced in lib/event.ts.
  if (!EVENT.speakersAnnounced) notFound();

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
