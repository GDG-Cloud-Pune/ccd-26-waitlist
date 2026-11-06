import type { Metadata } from "next";
import Link from "next/link";
import { Callout, LegalPage, type LegalSection } from "@/components/site/LegalPage";
import { EVENT } from "@/lib/event";
import { sharePreview } from "@/lib/site";

const description = `The terms for registering for and attending ${EVENT.name} ${EVENT.year}. Tickets are non-refundable and non-transferable.`;

export const metadata: Metadata = {
  title: "Terms and conditions",
  description,
  alternates: { canonical: "/terms" },
  ...sharePreview(`Terms and conditions · ${EVENT.name} ${EVENT.year}`, description, "/terms"),
};

const contact = <a href={`mailto:${EVENT.contactEmail}`}>{EVENT.contactEmail}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: (
      <>
        <p>
          These terms apply to everyone who registers for or attends {EVENT.name} {EVENT.year} on {EVENT.dateLong}{" "}
          at {EVENT.venue}. By registering, you agree to them and to our{" "}
          <Link href="/code-of-conduct">code of conduct</Link>.
        </p>
        <p>
          The event is organised by {EVENT.organiser}, an independent, volunteer-run community group in the Google
          Developer Groups programme. It is not organised by Google, and Google is not responsible for it.
        </p>
      </>
    ),
  },
  {
    id: "tickets",
    title: "Tickets",
    body: (
      <>
        <Callout>
          <strong>All tickets are non-refundable and non-transferable.</strong> Once a ticket is booked, we
          can&rsquo;t refund it, and it can&rsquo;t be passed on, resold or given to someone else.
        </Callout>
        <ul>
          <li>
            Tickets are sold only through KonfHub, our ticketing partner. Tickets bought anywhere else are not
            valid.
          </li>
          <li>Each ticket admits one person: the person named on it.</li>
          <li>
            Your ticket and its QR code are sent to the email you registered with. Bring it to the event, on your
            phone or printed.
          </li>
          <li>
            Pass types, prices and availability are shown on KonfHub and may change, for example when a pass
            sells out.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "entry",
    title: "Entry and check-in",
    body: (
      <ul>
        <li>
          Bring your ticket and a government-issued photo ID that matches the name on your registration. We may
          refuse entry if the details don&rsquo;t match.
        </li>
        <li>
          The organisers may refuse entry to, or remove, anyone who breaks these terms or the code of conduct.
          No refund is given in that case.
        </li>
        <li>Attendees under 18 need written consent from a parent or guardian.</li>
      </ul>
    ),
  },
  {
    id: "programme",
    title: "Programme changes",
    body: (
      <p>
        The agenda, speakers, sessions and timings may change before or on the day. Workshop seats are limited.
        If we ever have to postpone or cancel the event, we&rsquo;ll email everyone who registered with what
        happens next.
      </p>
    ),
  },
  {
    id: "venue",
    title: "At the venue",
    body: (
      <ul>
        <li>Follow the venue&rsquo;s rules and the instructions of organisers, volunteers and venue staff.</li>
        <li>
          Weapons, alcohol, illegal drugs and hazardous items aren&rsquo;t allowed. Smoking and vaping are only
          allowed where the venue permits them.
        </li>
        <li>
          You&rsquo;re responsible for your own belongings. Hand anything you find to the registration desk.
        </li>
        <li>
          Selling, promoting or recruiting at the event without the organisers&rsquo; permission isn&rsquo;t
          allowed.
        </li>
      </ul>
    ),
  },
  {
    id: "media",
    title: "Photos and recordings",
    body: (
      <p>
        The event will be photographed and filmed, and talks may be recorded. By attending, you agree that you may
        appear in photos and videos that {EVENT.organiser} shares on its website and social media. If you&rsquo;d
        rather not be photographed, tell a volunteer at check-in.
      </p>
    ),
  },
  {
    id: "data",
    title: "Your information",
    body: (
      <p>
        KonfHub collects your registration details and shares them with {EVENT.organiser} to run the event: for
        check-in, event emails and safety. We don&rsquo;t sell your details, and sponsors only receive them if you
        choose to share them yourself, for example by having your badge scanned at a booth.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        We may update these terms before the event; the date at the top of this page shows the latest version.
        Questions? Email {contact}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      pill="Terms and conditions"
      title="Terms and"
      accent="conditions."
      lede="What you agree to when you register for and attend the event. Please read the ticket rules before you book."
      updated="6 November 2026"
      sections={SECTIONS}
    />
  );
}
