import type { Metadata } from "next";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { ORGANISERS, VOLUNTEERS } from "@/data/team";
import { EVENT } from "@/lib/event";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Team",
  description: `The ${EVENT.organiser} members and volunteers who organise ${EVENT.name}.`,
};

const CHIP_COLORS = ["var(--blue)", "var(--green)", "var(--yellow)", "var(--red)"];

export default function TeamPage() {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>Team</span>
          <h1 className={styles.title}>
            Run by the <span className={styles.yellow}>community.</span>
          </h1>
          <p className={styles.lede}>
            {EVENT.name} is organised entirely by {EVENT.organiser} members and volunteers who give their weekends to
            make it happen.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <h2 className={styles.h2}>Organisers</h2>
            <span className={styles.count}>{ORGANISERS.length} people</span>
          </div>
          <div className={styles.organiserGrid}>
            {ORGANISERS.map((person, i) => (
              <div key={person.id} data-reveal={(i % 3) * 90}>
                <div className={styles.organiserCard}>
                  <div className={styles.organiserPhoto}>
                    <PhotoSlot src={person.photo} alt={person.name} label="Organiser photo" sizes="(max-width: 900px) 50vw, 270px" />
                  </div>
                  <div className={styles.organiserBody}>
                    <div className={styles.personText}>
                      <div className={styles.personName}>{person.name}</div>
                      <div className={styles.personRole}>{person.role}</div>
                    </div>
                    <span className={styles.chip} style={{ background: CHIP_COLORS[i % 4] }} aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <h2 className={styles.h2}>Volunteers</h2>
            <span className={styles.count}>{VOLUNTEERS.length} people</span>
          </div>
          <div className={styles.volunteerGrid}>
            {VOLUNTEERS.map((person, i) => (
              <div key={person.id} data-reveal={(i % 6) * 60}>
                <div className={styles.volunteerCard}>
                  <div className={styles.volunteerPhoto}>
                    <PhotoSlot src={person.photo} alt={person.name} label="Photo" sizes="(max-width: 900px) 40vw, 180px" />
                  </div>
                  <div className={styles.volunteerText}>
                    <div className={styles.volunteerName}>{person.name}</div>
                    <div className={styles.volunteerRole}>
                      <span className={styles.dot} style={{ background: CHIP_COLORS[i % 4] }} aria-hidden="true" />
                      {person.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div data-reveal="0" className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Want to help run CCD?</h2>
          <a href={`mailto:${EVENT.contactEmail}`} className={styles.ctaButton}>
            Get in touch <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
