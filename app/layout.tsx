import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { ANALYTICS_ENABLED, GA_MEASUREMENT_ID } from "@/lib/analytics";
import { EVENT } from "@/lib/event";
import { SITE_URL, sharePreview } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-space-mono",
  display: "swap",
});

const title = `${EVENT.name} ${EVENT.year} · ${EVENT.city}`;
const description = `${EVENT.name} is ${EVENT.organiser}'s annual conference for developers building on Google Cloud and AI. ${EVENT.dateLong} at ${EVENT.venue}.`;

export const metadata: Metadata = {
  // Absolute base for share images and canonical links; SITE_URL overrides it for preview deploys.
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${EVENT.name} ${EVENT.year}` },
  description,
  applicationName: `${EVENT.name} ${EVENT.year}`,
  authors: [{ name: EVENT.organiser, url: EVENT.communityUrl }],
  publisher: EVENT.organiser,
  category: "technology",
  keywords: [
    `${EVENT.name} ${EVENT.city}`,
    `${EVENT.name} ${EVENT.year}`,
    EVENT.organiser,
    "Google Cloud",
    "GDG Pune",
    "developer conference Pune",
    "AI conference Pune",
  ],
  // Stops iOS turning dates and numbers into tap-to-call links.
  formatDetection: { telephone: false, address: false, email: false },
  ...sharePreview(title, description, "/"),
};

export const viewport: Viewport = {
  themeColor: "#1e1e1e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body>
        {children}
        <Analytics enabled={ANALYTICS_ENABLED} measurementId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
