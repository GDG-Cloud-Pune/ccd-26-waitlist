/** Public address of the site, for canonical links, the sitemap, share images and structured data. */
export const SITE_URL = (process.env.SITE_URL ?? "https://ccd.gdgcloudpune.in").replace(/\/+$/, "");

/** Link-preview image, rendered by scripts/render-og-image.mjs. */
export const SHARE_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Cloud Community Day 2026, Sunday 6 December at The Orchid, Pune",
};

/**
 * Link-preview tags for a page. Next replaces (rather than merges) a parent's openGraph and twitter
 * objects, so each page passes its own title alongside the shared image.
 */
export const sharePreview = (title: string, description: string, path: string) => ({
  openGraph: { title, description, url: path, type: "website" as const, siteName: "GDG Cloud Pune", locale: "en_IN", images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image" as const, title, description, images: [SHARE_IMAGE] },
});

export const absoluteUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`;
