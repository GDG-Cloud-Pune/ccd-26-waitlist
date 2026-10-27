import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "@/components/brand/Icon";
import { AfterFilm } from "@/components/home/AfterFilm";
import { Countdown } from "@/components/home/Countdown";
import { Faq } from "@/components/home/Faq";
import { Hero3D } from "@/components/home/Hero3D";
import { Loader } from "@/components/home/Loader";
import { RegisterLink } from "@/components/site/RegisterLink";
import { SpeakerCard } from "@/components/site/SpeakerCard";
import { EDITIONS, FAQS, GALLERY, SPONSORS } from "@/data/home";
import { FEATURED_SPEAKERS } from "@/data/speakers";
import { EVENT, registrationLink } from "@/lib/event";
import { SOCIAL_LINKS } from "@/lib/socials";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** schema.org Event, so search engines can show the date and venue as an event listing. */
const EVENT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${EVENT.name} ${EVENT.city} ${EVENT.year}`,
  description: `${EVENT.name} is ${EVENT.organiser}'s annual conference for developers building on Google Cloud and AI: main-stage talks and hands-on workshops.`,
  startDate: EVENT.startsAt,
  endDate: EVENT.endsAt,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  url: SITE_URL,
  image: [absoluteUrl("/og-image.png"), absoluteUrl(EVENT.afterFilm.poster)],
  inLanguage: "en-IN",
  offers: {
    "@type": "Offer",
    url: registrationLink("hero"),
    availability: EVENT.registrationsOpen ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
  },
  location: {
    "@type": "Place",
    name: EVENT.venueName,
    address: {
      "@type": "PostalAddress",
      addressLocality: EVENT.city,
      addressRegion: EVENT.region,
      addressCountry: "IN",
    },
  },
  organizer: {
    "@type": "Organization",
    name: EVENT.organiser,
    url: EVENT.communityUrl,
    email: EVENT.contactEmail,
    logo: absoluteUrl("/gdg-cloud-pune-logo.png"),
    sameAs: SOCIAL_LINKS.map((social) => social.href),
  },
};

const HOME_TRACKS = [
  {
    title: "Main Stage",
    text: "Keynotes and talks on Google Cloud, AI and what teams are shipping in production.",
    color: "var(--blue)",
  },
  {
    title: "Workshops",
    text: "Laptop-open, hands-on sessions led by practitioners. Limited seats per workshop.",
    color: "var(--green)",
  },
];

const GALLERY_ROWS = [GALLERY.filter((_, i) => i % 2 === 0), GALLERY.filter((_, i) => i % 2 === 1)];

/** Attendance is drawn as dots, one per this many people, on a grid sized for the biggest edition. */
const PEOPLE_PER_DOT = 50;
const DOT_COUNT = Math.ceil(Math.max(...EDITIONS.map((edition) => edition.attendance)) / PEOPLE_PER_DOT);

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaping "<" keeps the JSON from ever closing the script tag early.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(EVENT_JSON_LD).replace(/</g, "\\u003c") }}
      />
      <Loader />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.pillSolid}>{EVENT.edition}</span>

            <h1 className={styles.title}>
              <span className={styles.titleLine}>Cloud</span>{" "}
              <span className={styles.titleLine}>Community Day</span>
            </h1>

            <div className={styles.badges}>
              <span className={styles.badgeGhost}>{EVENT.city}</span>
              <span className={styles.badgeSolid}>{EVENT.year}</span>
              <div className={styles.colorBar} aria-hidden="true">
                <span style={{ background: "var(--blue)" }} />
                <span style={{ background: "var(--green)" }} />
                <span style={{ background: "var(--yellow)" }} />
                <span style={{ background: "var(--red)" }} />
              </div>
            </div>

            <p className={styles.lede}>
              One day of Google Cloud and AI: main-stage talks and hands-on workshops, built by the community, for the
              community.
            </p>

            <div className={styles.facts}>
              <div className={styles.fact}>
                <span className={styles.factLabel}>Date</span>
                <span className={styles.factValue}>{EVENT.dateLong}</span>
              </div>
              <div className={styles.fact}>
                <span className={styles.factLabel}>Venue</span>
                <span className={styles.factValue}>{EVENT.venue}</span>
              </div>
            </div>

            <Countdown />

            <RegisterLink placement="hero" className={styles.heroButton} />
          </div>

          {/* The Wada is framed in this column; the 3D scene itself runs under the whole hero. */}
          <div className={styles.heroArt} data-hero-focus>
            <div className={styles.heroArtInner} data-parallax="0.08">
              <Hero3D />
            </div>
            <span className={styles.dragHint}>
              <Icon name="move-horizontal" size={16} /> Drag to rotate
            </span>
          </div>
        </div>
      </section>

      <section id="register" className={styles.register}>
        <div className={styles.registerInner}>
          <div className={styles.registerCopy} data-reveal="0">
            <span className={styles.eyebrow}>Register</span>
            <h2 className={styles.h2}>
              Registrations are <span className={styles.yellow}>open.</span>
            </h2>
            <p className={styles.body}>
              Tickets are on KonfHub. Workshop seats are limited, so register early to get your pick.
            </p>
          </div>
          <div className={styles.registerCard} data-reveal="120">
            <dl className={styles.registerFacts}>
              <div className={styles.registerFact}>
                <dt className={styles.factLabel}>Date</dt>
                <dd className={styles.factValue}>{EVENT.dateLong}</dd>
              </div>
              <div className={styles.registerFact}>
                <dt className={styles.factLabel}>Venue</dt>
                <dd className={styles.factValue}>{EVENT.venue}</dd>
              </div>
              <div className={styles.registerFact}>
                <dt className={styles.factLabel}>Format</dt>
                <dd className={styles.factValue}>Main-stage talks and hands-on workshops</dd>
              </div>
            </dl>
            <RegisterLink placement="register" className={styles.registerButton} />
            <p className={styles.registerNote}>Registration is handled on KonfHub, which opens in a new tab.</p>
          </div>
        </div>
      </section>

      <section id="about" className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.aboutTop}>
            <div data-reveal="0" className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>About</span>
              <h2 className={styles.h2}>
                Five years of building, <span className={styles.yellow}>together.</span>
              </h2>
            </div>
            <p data-reveal="120" className={styles.body}>
              {EVENT.name} is {EVENT.organiser}&rsquo;s annual conference for developers building on Google Cloud and AI.
              We grew fast, then chose depth over scale, and the fifth edition keeps what worked: one day, two tracks,
              main-stage talks and hands-on workshops.
            </p>
          </div>

          <div className={styles.editionGrid}>
            {EDITIONS.map((edition, i) => {
              const isCurrent = edition.attendance === 0;
              return (
                <div
                  key={edition.year}
                  data-reveal={i * 90}
                  className={styles.editionCard}
                  data-current={isCurrent ? "" : undefined}
                  style={isCurrent ? undefined : { background: edition.color, color: "var(--ink)" }}
                >
                  <div className={styles.editionTop}>
                    <span className={styles.editionNum}>{edition.num}</span>
                    <span className={styles.editionYear}>{edition.year}</span>
                  </div>
                  <p className={styles.editionNote}>{edition.note}</p>
                  {/*
                    Turnout as dots, one per 50 people. The chart and number sit on the bottom edge,
                    so they line up across cards however long each note runs.
                  */}
                  <div className={styles.editionChart} aria-hidden="true">
                    {isCurrent ? (
                      <div className={styles.editionBarCurrent} />
                    ) : (
                      <div className={styles.editionDots}>
                        {Array.from({ length: DOT_COUNT }, (_, d) => (
                          <span
                            key={d}
                            className={styles.personDot}
                            data-filled={d < Math.round(edition.attendance / PEOPLE_PER_DOT) ? "" : undefined}
                            style={{ "--i": d } as CSSProperties}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className={styles.editionCount}>{edition.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hidden until the line-up is final: flip EVENT.speakersAnnounced in lib/event.ts. */}
      {EVENT.speakersAnnounced && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div data-reveal="0" className={styles.sectionHead}>
              <div className={styles.sectionHeadStack}>
                <span className={styles.eyebrow}>Speakers</span>
                <h2 className={styles.h2}>Who&rsquo;s on stage</h2>
              </div>
              <Link href="/speakers" className={styles.ghostButton}>
                All speakers <Icon name="arrow-right" />
              </Link>
            </div>
            <div className={styles.speakerGrid}>
              {FEATURED_SPEAKERS.map((speaker, i) => (
                <SpeakerCard key={speaker.id} speaker={speaker} delay={i * 90} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <div className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>Agenda</span>
              <h2 className={styles.h2}>Two tracks, one day</h2>
            </div>
{EVENT.agendaPublished && (
              <Link href="/agenda" className={styles.ghostButton}>
                Full agenda <Icon name="arrow-right" />
              </Link>
            )}
          </div>
          <div className={styles.trackGrid}>
            {HOME_TRACKS.map((track, i) => {
              const content = (
                <>
                  <div className={styles.trackTop}>
                    <span className={styles.trackTag}>Track {String(i + 1).padStart(2, "0")}</span>
                    {EVENT.agendaPublished && <Icon name="arrow-right" size={30} />}
                  </div>
                  <div className={styles.trackBody}>
                    <div className={styles.trackTitle}>{track.title}</div>
                    <div className={styles.trackText}>{track.text}</div>
                  </div>
                </>
              );
              const props = { "data-reveal": i * 120, className: styles.trackCard, style: { background: track.color } };
              // Cards link to the agenda once it's published; until then they're plain cards.
              return EVENT.agendaPublished ? (
                <Link key={track.title} href="/agenda" {...props}>
                  {content}
                </Link>
              ) : (
                <div key={track.title} {...props}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div data-reveal="0" className={styles.cfsCard}>
          <div className={styles.sectionHeadStack}>
            <span className={styles.eyebrowDark}>Call for speakers</span>
            <h2 className={styles.cfsTitle}>Got something worth sharing?</h2>
          </div>
          <div className={styles.cfsSide}>
            <p className={styles.cfsText}>
              We&rsquo;re looking for talks and workshops on Google Cloud, AI, data and DevOps, and first-time
              speakers are welcome too. Submissions open soon.
            </p>
            <span className={styles.statusLabel}>
              <span className={styles.statusDot} aria-hidden="true" />
              Opening soon
            </span>
          </div>
        </div>
      </section>

      {EVENT.afterFilm.youtubeId && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div data-reveal="0" className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>The film</span>
              <h2 className={styles.h2}>
                Relive <span className={styles.yellow}>{EVENT.afterFilm.year}.</span>
              </h2>
            </div>
            <div data-reveal="120">
              <AfterFilm
                videoId={EVENT.afterFilm.youtubeId}
                title={`${EVENT.name} ${EVENT.afterFilm.year}, the film`}
                poster={EVENT.afterFilm.poster}
              />
            </div>
          </div>
        </section>
      )}

      <section className={styles.gallerySection}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHeadStack}>
            <span className={styles.eyebrow}>Gallery</span>
            <h2 className={styles.h2}>From past editions</h2>
          </div>
        </div>
        {/* Two rows drifting in opposite directions; each row is drawn three times so the loop never shows a gap. */}
        <div className={styles.marquee} data-reveal="120">
          {GALLERY_ROWS.map((row, r) => (
            <div key={r} className={styles.marqueeRow} data-reverse={r === 1 ? "" : undefined}>
              {[0, 1, 2].flatMap((copy) =>
                row.map((photo) => (
                  <figure
                    key={`${photo.id}-${copy}`}
                    className={styles.marqueeItem}
                    style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                    aria-hidden={copy > 0 || undefined}
                  >
                    <Image src={photo.src} alt={copy > 0 ? "" : photo.alt} fill sizes="480px" />
                  </figure>
                )),
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <div className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>Sponsors &amp; partners</span>
              <h2 className={styles.h2}>Made possible by</h2>
            </div>
            <a href={`mailto:${EVENT.contactEmail}`} className={styles.ghostButton}>
              Become a sponsor <Icon name="arrow-right" />
            </a>
          </div>
          {SPONSORS.map((sponsor) => (
            <div key={sponsor.name} data-reveal="0" className={styles.tierRow}>
              <span className={styles.tierName}>{sponsor.tier}</span>
              <a
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sponsorCard}
                data-logo={sponsor.logo ? "" : undefined}
                aria-label={`${sponsor.name} (opens in a new tab)`}
              >
                {sponsor.logo ? (
                  // SVG logos are served as-is; the image optimiser only handles raster formats.
                  <Image src={sponsor.logo} alt="" fill unoptimized className={styles.sponsorLogo} />
                ) : (
                  <span className={styles.sponsorName}>{sponsor.name}</span>
                )}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.faqGrid}>
          <div data-reveal="0" className={styles.sectionHeadStack}>
            <span className={styles.eyebrow}>FAQ</span>
            <h2 className={styles.h2}>Good to know</h2>
          </div>
          <div data-reveal="120">
            <Faq items={FAQS} />
          </div>
        </div>
      </section>
    </>
  );
}
