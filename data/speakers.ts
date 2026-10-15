import type { TrackName } from "@/lib/event";

export type Speaker = {
  id: string;
  name: string;
  role: string;
  track: TrackName;
  time: string;
  talk: string;
  abstract: string;
  /** Drop a file in public/speakers/<id>.jpg and set this to "/speakers/<id>.jpg". */
  photo?: string;
  linkedin?: string;
  x?: string;
};

const PLACEHOLDER = {
  name: "Speaker Name",
  role: "Role · Company",
  talk: "Session title to be announced",
  abstract: "Two or three lines on what attendees will learn and take home from this session.",
};

// Placeholder line-up from the design: 12 slots across the two tracks.
const SCHEDULE: [TrackName, string][] = [
  ["Main Stage", "09:45"],
  ["Main Stage", "10:30"],
  ["Workshops", "10:30"],
  ["Main Stage", "11:15"],
  ["Workshops", "12:00"],
  ["Main Stage", "12:00"],
  ["Workshops", "14:00"],
  ["Main Stage", "14:00"],
  ["Workshops", "15:30"],
  ["Main Stage", "15:15"],
  ["Workshops", "16:15"],
  ["Main Stage", "16:30"],
];

export const SPEAKERS: Speaker[] = SCHEDULE.map(([track, time], i) => ({
  id: `speaker-${i + 1}`,
  track,
  time,
  ...PLACEHOLDER,
}));

/** The four shown in the home page preview. */
export const FEATURED_SPEAKERS: Speaker[] = [
  SPEAKERS[0],
  SPEAKERS[2],
  SPEAKERS[5],
  SPEAKERS[6],
];
