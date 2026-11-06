import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, type LegalSection } from "@/components/site/LegalPage";
import { EVENT } from "@/lib/event";
import { sharePreview } from "@/lib/site";

const description = `The code of conduct for ${EVENT.name} ${EVENT.year}: how we expect everyone to behave, what isn't allowed, and how to report a problem.`;

export const metadata: Metadata = {
  title: "Code of conduct",
  description,
  alternates: { canonical: "/code-of-conduct" },
  ...sharePreview(`Code of conduct · ${EVENT.name} ${EVENT.year}`, description, "/code-of-conduct"),
};

const contact = <a href={`mailto:${EVENT.contactEmail}`}>{EVENT.contactEmail}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "commitment",
    title: "Our commitment",
    body: (
      <>
        <p>
          {EVENT.name} is a community event, and we want it to be a welcoming, harassment-free experience for
          everyone, whatever their gender, gender identity and expression, sexual orientation, disability, physical
          appearance, body size, age, race, ethnicity, religion, caste, nationality or level of experience.
        </p>
        <p>
          This code follows{" "}
          <a href={EVENT.googleCommunityGuidelinesUrl} target="_blank" rel="noopener noreferrer">
            Google&rsquo;s developer community guidelines
          </a>{" "}
          and{" "}
          <a href={EVENT.googleAntiHarassmentPolicyUrl} target="_blank" rel="noopener noreferrer">
            event anti-harassment policy
          </a>
          , which apply to every Google Developer Groups event.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    title: "Who and where it applies",
    body: (
      <p>
        The code applies to everyone taking part: attendees, speakers, workshop mentors, volunteers, organisers,
        sponsors, exhibitors and partners. It covers the whole event, from talks, workshops and booths to the
        registration desk, meals and breaks, and any social or after-event gatherings. It also covers our online
        spaces, such as social media, WhatsApp groups and event chats.
      </p>
    ),
  },
  {
    id: "expected",
    title: "What we expect",
    body: (
      <ul>
        <li>Be respectful and considerate. Disagree about ideas, never about people.</li>
        <li>Make room for others: welcome first-timers and beginners, and let everyone be heard.</li>
        <li>Ask before you photograph or record someone up close, and respect a no.</li>
        <li>Respect personal space, and look out for each other.</li>
        <li>Follow the instructions of organisers, volunteers and venue staff.</li>
        <li>If you see something that worries you, tell an organiser or volunteer.</li>
      </ul>
    ),
  },
  {
    id: "unacceptable",
    title: "What isn't acceptable",
    body: (
      <>
        <p>Harassment in any form is not tolerated. This includes:</p>
        <ul>
          <li>
            Offensive or demeaning comments, jokes or slurs about anyone&rsquo;s identity, background or appearance.
          </li>
          <li>Sexual language or imagery in talks, slides, booths, swag or online spaces.</li>
          <li>Unwelcome sexual attention, and any physical contact without consent.</li>
          <li>Intimidation, threats, stalking or following someone.</li>
          <li>Photographing or recording someone who has asked you not to.</li>
          <li>Repeatedly disrupting talks, workshops or other sessions.</li>
          <li>Sharing someone&rsquo;s personal information without their permission.</li>
          <li>Retaliating against anyone who reports a problem or helps with an investigation.</li>
        </ul>
        <p>Anyone asked to stop harassing behaviour is expected to stop immediately.</p>
      </>
    ),
  },
  {
    id: "sponsors",
    title: "Sponsors and speakers",
    body: (
      <p>
        Sponsors, exhibitors and speakers are held to the same standard. Talks, slides and booths must not use
        sexualised images, costumes or activities, and sponsors may only collect an attendee&rsquo;s details with
        that person&rsquo;s clear consent. If a sponsor or speaker breaks the code, we may end the booth or talk
        straight away.
      </p>
    ),
  },
  {
    id: "reporting",
    title: "Reporting a problem",
    body: (
      <>
        <p>
          If you experience or witness harassment, or have any other concern, tell an organiser or volunteer at the
          venue. They&rsquo;re easy to spot by their badges and T-shirts. You can also go to the registration desk,
          or email {contact} during or after the event.
        </p>
        <p>
          We&rsquo;ll treat your report confidentially and take it seriously. Our team can help you contact venue
          security or the police, walk you somewhere you feel safe, or help in whatever way you need. In an
          emergency, call 112 first.
        </p>
      </>
    ),
  },
  {
    id: "consequences",
    title: "Consequences",
    body: (
      <>
        <p>
          The organisers may take any action they think is appropriate. This could range from a warning to
          removal from the event without a refund, a ban from future {EVENT.organiser} events, or a referral to
          venue security or the police.
        </p>
        <p>
          The code works alongside our <Link href="/terms">terms and conditions</Link>, which you accept when you
          register.
        </p>
      </>
    ),
  },
];

export default function CodeOfConductPage() {
  return (
    <LegalPage
      pill="Code of conduct"
      title="Code of"
      accent="conduct."
      lede={
        <>
          {EVENT.name} is for everyone. By registering for or taking part in the event, you agree to follow this
          code of conduct.
        </>
      }
      updated="6 November 2026"
      sections={SECTIONS}
    />
  );
}
