import type { Metadata, Viewport } from "next";
import { Outfit, Space_Mono } from "next/font/google";
import { EVENT } from "@/lib/event";
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
  title: { default: title, template: `%s · ${EVENT.name} ${EVENT.year}` },
  description,
  openGraph: { title, description, type: "website", siteName: EVENT.organiser },
  twitter: { card: "summary", title, description },
};

export const viewport: Viewport = {
  themeColor: "#1e1e1e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${outfit.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
