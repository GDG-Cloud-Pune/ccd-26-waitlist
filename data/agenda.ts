/** Placeholder running order from the design. Times are 24h, event-local (IST). */
export type AgendaTrack = "all" | "main" | "work";

export type Session = {
  track: AgendaTrack;
  start: string;
  end: string;
  kind: "Break" | "Opening" | "Keynote" | "Talk" | "Panel" | "Workshop" | "Lightning" | "Closing";
  title: string;
  speaker?: string;
};

export const DAY_START = "08:30";
export const DAY_END = "17:30";
/** Minutes per grid row. */
export const SLOT_MINUTES = 15;

export const SESSIONS: Session[] = [
  { track: "all", start: "08:30", end: "09:30", kind: "Break", title: "Registration & breakfast" },
  { track: "all", start: "09:30", end: "09:45", kind: "Opening", title: "Welcome to Cloud Community Day 2026" },
  { track: "all", start: "09:45", end: "10:30", kind: "Keynote", title: "Opening keynote", speaker: "Keynote speaker" },
  { track: "main", start: "10:30", end: "11:00", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "11:00", end: "11:30", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "11:30", end: "12:00", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "12:00", end: "12:30", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "12:30", end: "13:00", kind: "Panel", title: "Panel discussion", speaker: "Panelists TBA" },
  { track: "work", start: "10:30", end: "12:00", kind: "Workshop", title: "Workshop title to be announced", speaker: "Workshop lead" },
  { track: "work", start: "12:00", end: "13:00", kind: "Workshop", title: "Workshop title to be announced", speaker: "Workshop lead" },
  { track: "all", start: "13:00", end: "14:00", kind: "Break", title: "Lunch & networking" },
  { track: "main", start: "14:00", end: "14:30", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "14:30", end: "15:00", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "15:00", end: "15:30", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "work", start: "14:00", end: "15:30", kind: "Workshop", title: "Workshop title to be announced", speaker: "Workshop lead" },
  { track: "all", start: "15:30", end: "15:45", kind: "Break", title: "Coffee break" },
  { track: "main", start: "15:45", end: "16:15", kind: "Talk", title: "Session title to be announced", speaker: "Speaker Name" },
  { track: "main", start: "16:15", end: "17:00", kind: "Lightning", title: "Lightning talks", speaker: "Community speakers" },
  { track: "work", start: "15:45", end: "17:00", kind: "Workshop", title: "Workshop title to be announced", speaker: "Workshop lead" },
  { track: "all", start: "17:00", end: "17:30", kind: "Closing", title: "Closing, raffle & group photo" },
];

export const minutesOf = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

export const durationLabel = (start: string, end: string) => {
  const d = minutesOf(end) - minutesOf(start);
  if (d < 60) return `${d} min`;
  const rest = d % 60;
  return `${Math.floor(d / 60)}h${rest ? ` ${rest}m` : ""}`;
};
