import type { Metadata } from "next";
import { Timetable } from "@/components/agenda/Timetable";
import { SESSIONS } from "@/data/agenda";
import { EVENT } from "@/lib/event";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Agenda",
  description: `The running order for ${EVENT.name} ${EVENT.year}: main-stage talks and hands-on workshops on ${EVENT.dateLong}.`,
};

export default function AgendaPage() {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.pills}>
            <span className={styles.pill}>Agenda</span>
            <span className={styles.pillSolid}>{EVENT.dateMedium}</span>
            <span className={styles.pill}>{EVENT.venue}</span>
          </div>
          <h1 className={styles.title}>
            One day.
            <br />
            <span className={styles.green}>Two tracks.</span>
          </h1>
          <p className={styles.lede}>
            Main-stage talks and hands-on workshops run side by side. Sessions and speakers are announced as
            they&rsquo;re confirmed.
          </p>
        </div>
      </section>

      <Timetable sessions={SESSIONS} />
    </>
  );
}
