import type { MetadataRoute } from "next";
import { EVENT } from "@/lib/event";
import { absoluteUrl } from "@/lib/site";

/** Only pages that are switched on in lib/event.ts; hidden ones answer 404 and stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; live: boolean; priority: number }[] = [
    { path: "/", live: true, priority: 1 },
    { path: "/agenda", live: EVENT.agendaPublished, priority: 0.8 },
    { path: "/speakers", live: EVENT.speakersAnnounced, priority: 0.8 },
    { path: "/team", live: EVENT.teamPublished, priority: 0.5 },
  ];

  return pages
    .filter((page) => page.live)
    .map(({ path, priority }) => ({ url: absoluteUrl(path), changeFrequency: "weekly", priority }));
}
