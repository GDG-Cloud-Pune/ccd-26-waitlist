"use client";

import { useEffect, useState } from "react";
import { DAY_END, DAY_START, SLOT_MINUTES, durationLabel, minutesOf, type AgendaTrack, type Session } from "@/data/agenda";
import { TRACKS } from "@/lib/event";
import styles from "./Timetable.module.css";

const NARROW = 760;
type Focus = "All" | "Main Stage" | "Workshops";

const BASE = minutesOf(DAY_START);
const ROWS = (minutesOf(DAY_END) - BASE) / SLOT_MINUTES;

const rowOf = (time: string) => (minutesOf(time) - BASE) / SLOT_MINUTES + 1;

export function Timetable({ sessions }: { sessions: Session[] }) {
  const [focus, setFocus] = useState<Focus>("All");
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${NARROW - 1}px)`);
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // On phones one track at a time; "All" isn't offered there.
  const effectiveFocus: Focus = narrow && focus === "All" ? "Main Stage" : focus;
  const inFocus = (track: AgendaTrack) =>
    track === "all" || effectiveFocus === "All" || (effectiveFocus === "Main Stage" ? track === "main" : track === "work");

  const visible = narrow ? sessions.filter((s) => inFocus(s.track)) : sessions;
  const columns = narrow ? "64px minmax(0,1fr)" : "84px minmax(0,1fr) minmax(0,1fr)";
  const startTimes = [...new Set(visible.map((s) => s.start))];
  const headers = (["Main Stage", "Workshops"] as const).filter((label) => !narrow || label === effectiveFocus);
  const tabs: Focus[] = narrow ? ["Main Stage", "Workshops"] : ["All", "Main Stage", "Workshops"];

  const columnOf = (track: AgendaTrack) => {
    if (track === "all") return narrow ? "2" : "2 / 4";
    if (narrow) return "2";
    return track === "main" ? "2" : "3";
  };

  return (
    <>
      <div className={styles.filterRow}>
        <div className={styles.filters} role="group" aria-label="Focus a track">
          {tabs.map((label) => {
            const color = label === "Main Stage" ? TRACKS["Main Stage"].color : label === "Workshops" ? TRACKS.Workshops.color : null;
            const active = effectiveFocus === label;
            return (
              <button
                key={label}
                type="button"
                className={styles.filter}
                data-active={active ? "" : undefined}
                aria-pressed={active}
                onClick={() => setFocus(label)}
              >
                {color && <span className={styles.filterDot} style={{ background: color }} aria-hidden="true" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.headRow} style={{ gridTemplateColumns: columns }}>
            <span />
            {headers.map((label) => (
              <div
                key={label}
                className={styles.head}
                data-dim={!narrow && effectiveFocus !== "All" && effectiveFocus !== label ? "" : undefined}
              >
                <span className={styles.headDot} style={{ background: TRACKS[label].color }} aria-hidden="true" />
                {label}
                <span className={styles.headSub}>{TRACKS[label].blurb}</span>
              </div>
            ))}
          </div>

          <div
            className={styles.grid}
            style={{ gridTemplateColumns: columns, gridTemplateRows: `repeat(${ROWS}, minmax(30px, auto))` }}
          >
            {startTimes.map((time) => (
              <div key={time} className={styles.time} style={{ gridRow: `${rowOf(time)} / span 1` }}>
                {time}
              </div>
            ))}

            {visible.map((session) => {
              const isBreak = session.kind === "Break";
              const isHighlight = session.kind === "Keynote" || session.kind === "Opening" || session.kind === "Closing";
              const trackColor = session.track === "work" ? TRACKS.Workshops.color : TRACKS["Main Stage"].color;
              const dimmed = !narrow && !inFocus(session.track);

              return (
                <div
                  key={`${session.track}-${session.start}-${session.title}`}
                  className={styles.session}
                  data-break={isBreak ? "" : undefined}
                  data-highlight={isHighlight ? "" : undefined}
                  data-dim={dimmed ? "" : undefined}
                  style={{
                    gridColumn: columnOf(session.track),
                    gridRow: `${rowOf(session.start)} / ${rowOf(session.end)}`,
                    ...(isBreak || isHighlight
                      ? {}
                      : {
                          borderColor: trackColor,
                          background: session.track === "work" ? "#1f2b22" : session.track === "main" ? "#1f2433" : "var(--surface)",
                        }),
                  }}
                >
                  <div className={styles.sessionTop}>
                    {!isBreak && (
                      <span
                        className={styles.kind}
                        style={isHighlight ? undefined : { background: trackColor, borderColor: trackColor }}
                      >
                        {session.kind}
                      </span>
                    )}
                    <span className={styles.range}>
                      {session.start} – {session.end}
                    </span>
                    <span className={styles.duration}>{durationLabel(session.start, session.end)}</span>
                  </div>
                  <div className={styles.sessionTitle}>{session.title}</div>
                  {session.speaker && (
                    <div className={styles.speaker}>
                      <span className={styles.speakerAvatar} aria-hidden="true" />
                      <span>{session.speaker}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
