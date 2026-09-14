import Image from "next/image";
import { CloudMark } from "@/components/brand/CloudMark";
import { ColorBar } from "@/components/brand/ColorBar";
import { Pill } from "@/components/brand/Pill";
import { SocialLinks } from "@/components/SocialLinks";
import { WaitlistForm } from "@/components/WaitlistForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        {/* Trimmed from "GDG Professional - Horizontal - Dark" so the artwork sits flush with the page gutter. */}
        <Image
          src="/gdg-cloud-pune-logo.png"
          alt="Google Developer Groups Cloud Pune"
          width={1692}
          height={203}
          // Matches the CSS widths in page.module.css so the browser picks a small variant, not a 1920px one.
          sizes="(max-width: 900px) min(62vw, 260px), 440px"
          priority
          className={styles.logo}
        />
        <CloudMark className={styles.cloud} />
      </header>

      <section className={styles.poster} aria-labelledby="page-title">
        <div className={styles.lockup}>
          <h1 id="page-title" className={styles.wordmark}>
            <span>Cloud</span> <span>Community Day</span>
          </h1>
          <ColorBar className={styles.bar} />
          <div className={styles.metaRow}>
            <Pill tone="ghost" className={styles.location}>
              Pune
            </Pill>
            <Pill className={styles.year}>2026</Pill>
          </div>
        </div>

        <p className={styles.comingSoon}>Coming soon</p>
      </section>

      <section className={styles.panel} aria-labelledby="waitlist-title">
        <div className={styles.panelInner}>
          <WaitlistForm
            intro={
              <>
                <h2 id="waitlist-title" className={styles.cta}>
                  Join the waitlist
                </h2>
                <p className={styles.lede}>Be the first to know when registrations open.</p>
              </>
            }
          />
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.followLabel}>Follow us</span>
        <SocialLinks variant="icon" />
      </footer>
    </main>
  );
}
