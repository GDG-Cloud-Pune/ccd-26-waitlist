import { Footer } from "@/components/site/Footer";
import { Motion } from "@/components/site/Motion";
import { Nav } from "@/components/site/Nav";

/**
 * Skip link, nav, page transitions and footer around a page's content.
 * Shared by the site layout and the 404 page, which Next renders outside that layout.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Motion />
      <Nav />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
