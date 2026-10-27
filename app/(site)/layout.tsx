import { SiteChrome } from "@/components/site/SiteChrome";

/** Chrome for every page of the event site. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
