import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Timetable } from "@/components/agenda/Timetable";
import { SESSIONS } from "@/data/agenda";
import { EVENT } from "@/lib/event";
import { sharePreview } from "@/lib/site";
import styles from "./page.module.css";

const description = `The running order for ${EVENT.name} ${EVENT.year}: main-stage talks and hands-on workshops on ${EVENT.dateLong}.`;

export const metadata: Metadata = {
  title: "Agenda",
  description,
  alternates: { canonical: "/agenda" },
  ...sharePreview(`Agenda · ${EVENT.name} ${EVENT.year}`, description, "/agenda"),
};

export default function AgendaPage() {
  // Hidden until the running order is final: flip EVENT.agendaPublished in lib/event.ts.
  if (!EVENT.agendaPublished) notFound();

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
