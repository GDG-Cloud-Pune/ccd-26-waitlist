import Image from "next/image";
import Link from "next/link";
import { SocialIcon } from "@/components/brand/SocialIcon";
import { EVENT, NAV_LINKS } from "@/lib/event";
import { SOCIAL_LINKS } from "@/lib/socials";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <div className={styles.wordmark}>
              Cloud
              <br />
              Community Day
            </div>
            <div className={styles.bar} aria-hidden="true">
              <span style={{ background: "var(--blue)" }} />
              <span style={{ background: "var(--green)" }} />
              <span style={{ background: "var(--yellow)" }} />
              <span style={{ background: "var(--red)" }} />
            </div>
            <div className={styles.when}>
              {EVENT.dateCompact} · {EVENT.venue}
            </div>
          </div>

          <div className={styles.columns}>
            <div className={styles.column}>
              <div className={styles.columnTitle}>Event</div>
              {NAV_LINKS.map(({ key, label, href }) => (
                <Link key={key} href={href}>
                  {label}
                </Link>
              ))}
            </div>
            <div className={styles.column}>
              <div className={styles.columnTitle}>Community</div>
              <a href={EVENT.communityUrl} target="_blank" rel="noopener noreferrer">
                {EVENT.organiser}
              </a>
              <a href={EVENT.codeOfConductUrl} target="_blank" rel="noopener noreferrer">
                Code of conduct
              </a>
              <a href={`mailto:${EVENT.contactEmail}`}>Contact</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <Image
            src="/assets/gdg-cloud-pune.png"
            alt={EVENT.organiser}
            width={400}
            height={88}
            sizes="200px"
            className={styles.logo}
          />
          <ul className={styles.socials}>
            {SOCIAL_LINKS.map(({ name, href, icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${EVENT.organiser} on ${name} (opens in a new tab)`}
                  className={styles.social}
                >
                  <SocialIcon name={icon} />
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.copyright}>© {EVENT.year} {EVENT.organiser}</div>
        </div>
      </div>
    </footer>
  );
}
