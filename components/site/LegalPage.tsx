import type { ReactNode } from "react";
import { EVENT } from "@/lib/event";
import styles from "./LegalPage.module.css";

export type LegalSection = {
  /** Anchor, so a rule can be linked to, e.g. /terms#tickets. */
  id: string;
  title: string;
  body: ReactNode;
};

type LegalPageProps = {
  pill: string;
  /** Two-line heading like the agenda's: the second line is in yellow. */
  title: string;
  accent: string;
  lede: ReactNode;
  /** When the text last changed, e.g. "6 November 2026". */
  updated: string;
  sections: LegalSection[];
};

/** A rule set apart in a yellow outline, like the available pass in the register card. */
export function Callout({ children }: { children: ReactNode }) {
  return <p className={styles.callout}>{children}</p>;
}

/** The code of conduct and terms pages: the agenda page's header, then the text in sections. */
export function LegalPage({ pill, title, accent, lede, updated, sections }: LegalPageProps) {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.pills}>
            <span className={styles.pill}>{pill}</span>
            <span className={styles.pillSolid}>{EVENT.dateMedium}</span>
            <span className={styles.pill}>{EVENT.venue}</span>
          </div>
          <h1 className={styles.title}>
            {title}
            <br />
            <span className={styles.yellow}>{accent}</span>
          </h1>
          <p className={styles.lede}>{lede}</p>
          <span className={styles.updated}>Last updated {updated}</span>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          {sections.map(({ id, title: sectionTitle, body }) => (
            <section key={id} id={id} className={styles.section} aria-labelledby={`${id}-title`}>
              <h2 id={`${id}-title`} className={styles.sectionTitle}>
                {sectionTitle}
              </h2>
              <div className={styles.prose}>{body}</div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
