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
  /** Tickets are sold on KonfHub. Flip registrationsOpen to false to turn every Register button into a plain status. */
  registrationsOpen: true,
  registrationUrl: "https://konfhub.com/ccdpune",
  registrationLabel: "Register now",
  registrationClosedLabel: "Registrations closed",
} as const;

/** Where on the site a Register button sits; sent to KonfHub as utm_content and to Analytics. */
export type RegisterPlacement = "nav" | "menu" | "hero" | "register" | "not-found" | "waitlist-link";

/** The default utm_campaign for links to the event. */
export const CAMPAIGN = `ccd-${EVENT.city.toLowerCase()}-${EVENT.year}`;

/** The UTM tags KonfHub keeps through checkout and reports on (it ignores utm_term and utm_content). */
export const CAMPAIGN_TAGS = ["utm_source", "utm_medium", "utm_campaign"] as const;

/**
 * The KonfHub link tagged so KonfHub's analytics attribute the registration. `arrivedWith` is the
 * query string of UTM tags the visitor reached the site with (e.g. from an Instagram link); those
 * tags are passed on, and visitors who came without any are attributed to the website.
 */
export function registrationLink(placement: RegisterPlacement, arrivedWith = "") {
  const incoming = new URLSearchParams(arrivedWith);
  const fromCampaign = incoming.has("utm_source");
  const url = new URL(EVENT.registrationUrl);
  url.searchParams.set("utm_source", fromCampaign ? incoming.get("utm_source")! : "website");
  url.searchParams.set("utm_medium", incoming.get("utm_medium") ?? (fromCampaign ? "social" : "referral"));
  url.searchParams.set("utm_campaign", incoming.get("utm_campaign") ?? CAMPAIGN);
  url.searchParams.set("utm_content", placement);
  return url.toString();
}

/**
 * Short links for bios, posts and posters: ccd.gdgcloudpune.in/ig lands on the home page tagged as
 * Instagram, and the Register buttons pass that on to KonfHub. Paths are redirected in next.config.ts.
 */
export const SHORT_LINKS = [
  { path: "/ig", source: "instagram", medium: "social" },
  { path: "/li", source: "linkedin", medium: "social" },
  { path: "/x", source: "x", medium: "social" },
  { path: "/yt", source: "youtube", medium: "social" },
  { path: "/wa", source: "whatsapp", medium: "messaging" },
] as const;

/** Where a short link lands: the home page with its UTM tags. */
export function shortLinkDestination({ source, medium }: (typeof SHORT_LINKS)[number]) {
  const query = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: CAMPAIGN });
  return `/?${query}`;
}

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
