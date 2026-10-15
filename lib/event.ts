/** Single place for the event's facts, as used across every page. */
export const EVENT = {
  name: "Cloud Community Day",
  edition: "5th edition",
  organiser: "GDG Cloud Pune",
  year: "2026",
  city: "Pune",
  /** Start of day, IST — the countdown on the home page counts to this. */
  startsAt: "2026-12-06T09:00:00+05:30",
  dateLong: "Sunday, 6 December 2026",
  dateMedium: "Sun, 6 Dec 2026",
  dateShort: "6 Dec 2026",
  dateCompact: "6 December 2026",
  venue: "The Orchid, Pune",
  contactEmail: "contact@gdgcloudpune.in",
  communityUrl: "https://gdg.community.dev/gdg-cloud-pune/",
  codeOfConductUrl: "https://developers.google.com/community-guidelines",
  /** Flip to true once registrations open, then point registrationUrl somewhere. */
  registrationsOpen: false,
  registrationUrl: "",
  registrationLabel: "Registrations opening soon",
} as const;

export const NAV_LINKS = [
  { key: "home", label: "Home", href: "/" },
  { key: "speakers", label: "Speakers", href: "/speakers" },
  { key: "agenda", label: "Agenda", href: "/agenda" },
  { key: "team", label: "Team", href: "/team" },
] as const;

export const TRACKS = {
  "Main Stage": { color: "#4285f4", blurb: "Talks & keynotes" },
  Workshops: { color: "#34a853", blurb: "Hands-on · limited seats" },
} as const;

export type TrackName = keyof typeof TRACKS;
