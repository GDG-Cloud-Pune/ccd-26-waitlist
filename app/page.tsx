import Image from "next/image";
import { CloudMark } from "@/components/brand/CloudMark";
import { ColorBar } from "@/components/brand/ColorBar";
import { Pill } from "@/components/brand/Pill";
import { SiteHeader } from "@/components/SiteHeader";
import { SocialLinks } from "@/components/SocialLinks";
import { WaitlistForm } from "@/components/WaitlistForm";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <SiteHeader className={styles.header}>
        {/* Trimmed from "GDG Professional - Horizontal - Dark" so the artwork sits flush with the page gutter. */}
        <Image
          src="/gdg-cloud-pune-logo.png"
          alt="Google Developer Groups Cloud Pune"
          width={1692}
          height={203}
          // Matches the CSS widths below so the browser picks a small variant, not a 1920px one.
          sizes="(max-width: 900px) min(60vw, 230px), 440px"
          priority
          className={styles.logo}
        />
      </SiteHeader>

      <section className={styles.poster} aria-labelledby="page-title">
        <div className={styles.lockup}>
          {/* Phone layout only ("CCD Pune Waitlist" mobile design). */}
          <CloudMark className={styles.phoneCloud} />
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
                <p className={styles.lede}>
                  <span className={styles.ledeDesktop}>Be the first to know when registrations open.</span>
                  <span className={styles.ledePhone}>
                    Join the waitlist and be the first to know when registrations open.
                  </span>
                </p>
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
