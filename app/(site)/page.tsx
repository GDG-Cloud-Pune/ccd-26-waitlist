import Link from "next/link";
import { Countdown } from "@/components/home/Countdown";
import { Faq } from "@/components/home/Faq";
import { Hero3D } from "@/components/home/Hero3D";
import { Loader } from "@/components/home/Loader";
import { PhotoSlot } from "@/components/site/PhotoSlot";
import { SpeakerCard } from "@/components/site/SpeakerCard";
import { WaitlistForm } from "@/components/WaitlistForm";
import { EDITIONS, FAQS, GALLERY, SPONSOR_TIERS } from "@/data/home";
import { FEATURED_SPEAKERS } from "@/data/speakers";
import { EVENT } from "@/lib/event";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <Loader />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <div className={styles.pills}>
              <span className={styles.pillSolid}>{EVENT.edition}</span>
              <span className={styles.pill}>by {EVENT.organiser}</span>
            </div>

            <h1 className={styles.title}>
              Cloud
              <br />
              Community Day
            </h1>

            <p className={styles.lede}>
              One day of Google Cloud and AI — main-stage talks and hands-on workshops, built by the community, for the
              community.
            </p>

            <div className={styles.badges}>
              <span className={styles.badgeSolid}>{EVENT.year}</span>
              <span className={styles.badgeGhost}>{EVENT.city}</span>
              <div className={styles.colorBar} aria-hidden="true">
                <span style={{ background: "var(--blue)" }} />
                <span style={{ background: "var(--green)" }} />
                <span style={{ background: "var(--yellow)" }} />
                <span style={{ background: "var(--red)" }} />
              </div>
            </div>

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

            <div className={styles.ctaRow}>
              <a href="#waitlist" className={styles.ctaNotice}>
                <span>{EVENT.registrationLabel}</span>
                <span className={styles.ctaNoticeTag}>Join the waitlist</span>
              </a>
              <Link href="/agenda" className={styles.ghostButton}>
                View agenda <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className={styles.heroArt}>
            <div className={styles.heroArtInner} data-parallax="0.08">
              <Hero3D />
            </div>
            <span className={styles.dragHint}>↔ Drag to rotate</span>
          </div>
        </div>
        <div className={styles.heroRule} aria-hidden="true" />
      </section>

      <section id="waitlist" className={styles.waitlist}>
        <div className={styles.waitlistInner}>
          <div className={styles.waitlistCopy} data-reveal="0">
            <span className={styles.eyebrow}>Waitlist</span>
            <h2 className={styles.h2}>
              Be first in line when <span className={styles.yellow}>registrations open.</span>
            </h2>
            <p className={styles.body}>
              We&rsquo;ll email you the moment tickets go live — no other mail, no sharing your details.
            </p>
          </div>
          <div className={styles.waitlistCard} data-reveal="120">
            <WaitlistForm />
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
              We grew fast, then chose depth over scale — and the fifth edition keeps what worked: one day, two tracks,
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
                  style={isCurrent ? undefined : { background: edition.color, color: "var(--black)" }}
                >
                  <div className={styles.editionTop}>
                    <span className={styles.editionNum}>{edition.num}</span>
                    <span className={styles.editionYear}>{edition.year}</span>
                  </div>
                  <div className={styles.editionBarWrap}>
                    {isCurrent ? (
                      <div className={styles.editionBarCurrent} />
                    ) : (
                      <div
                        className={styles.editionBar}
                        style={{ height: Math.round((120 * edition.attendance) / 1000) }}
                      />
                    )}
                  </div>
                  <div className={styles.editionFoot}>
                    <div className={styles.editionCount}>{edition.count}</div>
                    <div className={styles.editionNote}>{edition.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <div className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>Speakers</span>
              <h2 className={styles.h2}>Who&rsquo;s on stage</h2>
            </div>
            <Link href="/speakers" className={styles.ghostButton}>
              All speakers <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.speakerGrid}>
            {FEATURED_SPEAKERS.map((speaker, i) => (
              <SpeakerCard key={speaker.id} speaker={speaker} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHead}>
            <div className={styles.sectionHeadStack}>
              <span className={styles.eyebrow}>Agenda</span>
              <h2 className={styles.h2}>Two tracks, one day</h2>
            </div>
            <Link href="/agenda" className={styles.ghostButton}>
              Full agenda <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.trackGrid}>
            <Link href="/agenda" data-reveal="0" className={styles.trackCard} style={{ background: "var(--blue)" }}>
              <div className={styles.trackTop}>
                <span className={styles.trackTag}>Track 01</span>
                <span aria-hidden="true">→</span>
              </div>
              <div className={styles.trackBody}>
                <div className={styles.trackTitle}>Main Stage</div>
                <div className={styles.trackText}>
                  Keynotes and talks on Google Cloud, AI and what teams are shipping in production.
                </div>
              </div>
            </Link>
            <Link href="/agenda" data-reveal="120" className={styles.trackCard} style={{ background: "var(--green)" }}>
              <div className={styles.trackTop}>
                <span className={styles.trackTag}>Track 02</span>
                <span aria-hidden="true">→</span>
              </div>
              <div className={styles.trackBody}>
                <div className={styles.trackTitle}>Workshops</div>
                <div className={styles.trackText}>
                  Laptop-open, hands-on sessions led by practitioners. Limited seats per workshop.
                </div>
              </div>
            </Link>
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
              We&rsquo;re looking for talks and workshops on Google Cloud, AI, data and DevOps — from first-time speakers
              too. Submissions open soon.
            </p>
            <span className={styles.darkPill}>
              <span className={styles.dot} aria-hidden="true" />
              Opening soon
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div data-reveal="0" className={styles.sectionHeadStack}>
            <span className={styles.eyebrow}>Gallery</span>
            <h2 className={styles.h2}>From past editions</h2>
          </div>
          <div className={styles.galleryGrid}>
            {GALLERY.map((item, i) => (
              <div
                key={item.id}
                data-reveal={(i % 3) * 80}
                className={styles.galleryCell}
                style={{ gridColumn: `span ${item.colSpan}`, gridRow: `span ${item.rowSpan}` }}
              >
                <PhotoSlot label={item.label} sizes="(max-width: 900px) 100vw, 400px" />
              </div>
            ))}
          </div>
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
              Become a sponsor <span aria-hidden="true">→</span>
            </a>
          </div>
          {SPONSOR_TIERS.map((tier) => (
            <div key={tier.name} data-reveal="0" className={styles.tierRow}>
              <span className={styles.tierName}>{tier.name}</span>
              <div
                className={styles.tierGrid}
                style={{ gridTemplateColumns: `repeat(auto-fill,minmax(min(100%,${tier.minWidth}px),1fr))` }}
              >
                {Array.from({ length: tier.slots }, (_, i) => (
                  <div key={i} className={styles.tierCell} style={{ height: tier.height }}>
                    <span className={styles.tierPlaceholder}>Sponsor logo</span>
                  </div>
                ))}
              </div>
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
