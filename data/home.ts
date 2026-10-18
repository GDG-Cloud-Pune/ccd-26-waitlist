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
  { num: "01", year: "2022", count: "400", note: "Where it started.", color: "var(--blue)", attendance: 400 },
  { num: "02", year: "2023", count: "700", note: "The community showed up.", color: "var(--green)", attendance: 700 },
  { num: "03", year: "2024", count: "1000+", note: "Our biggest edition yet.", color: "var(--yellow)", attendance: 1000 },
  { num: "04", year: "2025", count: "500", note: "Capped on purpose. Two tracks, hands-on, best feedback ever.", color: "var(--red)", attendance: 500 },
  { num: "05", year: "2026", count: "6 Dec", note: "The Orchid, Pune. Building on what worked.", color: "var(--off-white)", attendance: 0 },
];

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  /** Natural size of the file in /public, so each photo keeps its own shape in the marquee. */
  width: number;
  height: number;
};

// Even positions fill the top marquee row, odd positions the bottom one.
export const GALLERY: GalleryItem[] = [
  { id: "volunteers-2024", src: "/gallery/volunteers-2024.jpg", alt: "The volunteer team cheering on stage", width: 2000, height: 1333 },
  { id: "auditorium-balcony", src: "/gallery/auditorium-balcony.jpg", alt: "A packed auditorium seen from the balcony during a talk", width: 1125, height: 2000 },
  { id: "workshop", src: "/gallery/workshop.jpg", alt: "An attendee building in Firebase Studio during a workshop", width: 2000, height: 1125 },
  { id: "capturing-the-talk", src: "/gallery/capturing-the-talk.jpg", alt: "An attendee filming a talk on their phone", width: 2000, height: 1125 },
  { id: "standing-ovation", src: "/gallery/standing-ovation.jpg", alt: "The audience on its feet in the main auditorium", width: 2000, height: 1333 },
  { id: "hands-up", src: "/gallery/hands-up.jpg", alt: "Hands up across the hall during a session", width: 2000, height: 1125 },
  { id: "organisers-2024", src: "/gallery/organisers-2024.jpg", alt: "Organisers and speakers on stage at Cloud Community Day 2024", width: 2000, height: 1332 },
  { id: "audience-smiles", src: "/gallery/audience-smiles.jpg", alt: "Attendees smiling at a talk", width: 2000, height: 1125 },
  { id: "auditorium-stage", src: "/gallery/auditorium-stage.jpg", alt: "A speaker presenting on serverless cost savings to a full house", width: 2000, height: 1125 },
];

export type Sponsor = {
  tier: string;
  name: string;
  /** Logo in /public; the name is shown as text until a logo file is added. */
  logo?: string;
  url?: string;
};

export const SPONSORS: Sponsor[] = [
  {
    tier: "Title sponsor",
    name: "Google for Developers",
    logo: "/sponsors/google-for-developers.svg",
    url: "https://developers.google.com/",
  },
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
    a: "Developers, engineers, students and practitioners working with, or curious about, Google Cloud and AI.",
  },
  {
    q: "What's the format?",
    a: "Two tracks running in parallel: main-stage talks and hands-on workshops. Workshop seats are limited.",
  },
  {
    q: "Do I need a laptop?",
    a: "For workshops, yes: charged and ready. Main-stage sessions need nothing but you.",
  },
  {
    q: "Can I speak or sponsor?",
    a: "The call for speakers opens soon. For sponsorship, write to the organising team.",
  },
];
