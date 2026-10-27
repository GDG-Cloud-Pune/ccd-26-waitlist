import Link from "next/link";
import { Icon } from "@/components/brand/Icon";
import { RegisterLink } from "@/components/site/RegisterLink";
import { EVENT } from "@/lib/event";
import styles from "./NotFound.module.css";

/** Shown for unknown URLs and for pages that aren't switched on yet in lib/event.ts. */
export function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.pills}>
          <span className={styles.pill}>404</span>
          <span className={styles.pillSolid}>
            {EVENT.name} {EVENT.year}
          </span>
        </div>
        <h1 className={styles.title}>
          Nothing here <span className={styles.yellow}>yet.</span>
        </h1>
        <p className={styles.lede}>
          This page may have moved, or it isn&rsquo;t ready to show. Everything that&rsquo;s live is on the home page.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Back to home <Icon name="arrow-right" />
          </Link>
          <RegisterLink placement="not-found" className={styles.ghost} />
        </div>
      </div>
    </section>
  );
}
