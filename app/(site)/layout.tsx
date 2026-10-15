import { Footer } from "@/components/site/Footer";
import { Motion } from "@/components/site/Motion";
import { Nav } from "@/components/site/Nav";

/** Chrome for the event site. The standalone /waitlist page deliberately sits outside this. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Motion />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
