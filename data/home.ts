/** Content for the home page sections, as laid out in the design. */

export type Edition = {
  num: string;
  year: string;
  count: string;
  note: string;
  color: string;
  /** Attendance, used for the bar height; 0 draws the four-colour bar instead. */
  attendance: number;
};

export const EDITIONS: Edition[] = [
  { num: "01", year: "2022", count: "400", note: "Where it started.", color: "#4285f4", attendance: 400 },
  { num: "02", year: "2023", count: "700", note: "The community showed up.", color: "#34a853", attendance: 700 },
  { num: "03", year: "2024", count: "1000+", note: "Our biggest edition yet.", color: "#f9ab00", attendance: 1000 },
  { num: "04", year: "2025", count: "500", note: "Capped on purpose. Two tracks, hands-on, best feedback ever.", color: "#ea4335", attendance: 500 },
  { num: "05", year: "2026", count: "6 Dec", note: "The Orchid, Pune. Building on what worked.", color: "#f0f0f0", attendance: 0 },
];

export type GalleryItem = { id: string; label: string; colSpan: number; rowSpan: number };

export const GALLERY: GalleryItem[] = [
  { id: "gallery-1", label: "Keynote crowd", colSpan: 2, rowSpan: 2 },
  { id: "gallery-2", label: "Workshop in progress", colSpan: 1, rowSpan: 1 },
  { id: "gallery-3", label: "Hallway conversations", colSpan: 1, rowSpan: 1 },
  { id: "gallery-4", label: "Volunteers team", colSpan: 1, rowSpan: 2 },
  { id: "gallery-5", label: "Speaker on stage", colSpan: 2, rowSpan: 1 },
  { id: "gallery-6", label: "Swag & stalls", colSpan: 1, rowSpan: 1 },
  { id: "gallery-7", label: "Group photo", colSpan: 1, rowSpan: 1 },
];

export type SponsorTier = { name: string; slots: number; minWidth: number; height: number };

export const SPONSOR_TIERS: SponsorTier[] = [
  { name: "Title", slots: 1, minWidth: 320, height: 180 },
  { name: "Gold", slots: 3, minWidth: 220, height: 130 },
  { name: "Community", slots: 5, minWidth: 150, height: 96 },
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "When and where is it?",
    a: "Sunday, 6 December 2026 at The Orchid, Pune. It is a full-day event.",
  },
  {
    q: "How do I register?",
    a: "Registrations open soon. Join the waitlist above and we'll email you the moment they do.",
  },
  {
    q: "Who is it for?",
    a: "Developers, engineers, students and practitioners working with — or curious about — Google Cloud and AI.",
  },
  {
    q: "What's the format?",
    a: "Two tracks running in parallel: main-stage talks and hands-on workshops. Workshop seats are limited.",
  },
  {
    q: "Do I need a laptop?",
    a: "For workshops, yes — charged and ready. Main-stage sessions need nothing but you.",
  },
  {
    q: "Can I speak or sponsor?",
    a: "The call for speakers opens soon. For sponsorship, write to the organising team.",
  },
];
