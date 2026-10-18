/** Single place for the event's facts, as used across every page. */
export const EVENT = {
  name: "Cloud Community Day",
  edition: "5th edition",
  organiser: "GDG Cloud Pune",
  year: "2026",
  city: "Pune",
  /** Start of day, IST — the countdown on the home page counts to this. */
  startsAt: "2026-12-06T09:00:00+05:30",
  /** End of the day's programme (matches the agenda), for search engines' event listings. */
  endsAt: "2026-12-06T17:30:00+05:30",
  dateLong: "Sunday, 6 December 2026",
  dateMedium: "Sun, 6 Dec 2026",
  dateShort: "6 Dec 2026",
  dateCompact: "6 December 2026",
  venue: "The Orchid, Pune",
  venueName: "The Orchid",
  region: "Maharashtra",
  contactEmail: "gdgcloudpune@gmail.com",
  communityUrl: "https://gdg.community.dev/gdg-cloud-pune/",
  codeOfConductUrl: "https://developers.google.com/community-guidelines",
  /** Last year's after-film. The home page section stays hidden while youtubeId is empty. */
  afterFilm: {
    year: "2025",
    // https://youtu.be/OipQTTxP3ZU
    youtubeId: "OipQTTxP3ZU",
    poster: "/gallery/hall-group.jpg",
  },
  /** Flip to true once the speaker line-up is final: shows the Speakers page, nav link and home section. */
  speakersAnnounced: false,
  /** Flip to true once the running order is final: shows the Agenda page, nav link and links to it. */
  agendaPublished: true,
  /** Flip to true once the team line-up is final: shows the Team page and its nav link. */
  teamPublished: false,
  /** Flip to true once registrations open, then point registrationUrl somewhere. */
  registrationsOpen: false,
  registrationUrl: "",
  registrationLabel: "Registrations opening soon",
} as const;

const ALL_NAV_LINKS = [
  { key: "home", label: "Home", href: "/" },
  { key: "speakers", label: "Speakers", href: "/speakers" },
  { key: "agenda", label: "Agenda", href: "/agenda" },
  { key: "team", label: "Team", href: "/team" },
] as const;

/** Pages that aren't ready yet are left out of the nav and footer. */
export const NAV_LINKS = ALL_NAV_LINKS.filter(({ key }) => {
  if (key === "speakers") return EVENT.speakersAnnounced;
  if (key === "agenda") return EVENT.agendaPublished;
  if (key === "team") return EVENT.teamPublished;
  return true;
});

export const TRACKS = {
  "Main Stage": { color: "#4285f4", blurb: "Talks & keynotes" },
  Workshops: { color: "#34a853", blurb: "Hands-on · limited seats" },
} as const;

export type TrackName = keyof typeof TRACKS;
