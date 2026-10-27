import type { Metadata } from "next";
import { NotFound } from "@/components/site/NotFound";
import { SiteChrome } from "@/components/site/SiteChrome";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** Unknown URLs render outside the site layout, so the chrome is added here. */
export default function NotFoundPage() {
  return (
    <SiteChrome>
      <NotFound />
    </SiteChrome>
  );
}
