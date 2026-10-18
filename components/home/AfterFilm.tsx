"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./AfterFilm.module.css";

type AfterFilmProps = {
  videoId: string;
  title: string;
  /** One of our own photos, so nothing loads from YouTube until someone presses play. */
  poster: string;
};

export function AfterFilm({ videoId, title, poster }: AfterFilmProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.frame}>
      {playing ? (
        <iframe
          className={styles.player}
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <Image src={poster} alt="" fill sizes="(max-width: 1288px) 100vw, 1240px" className={styles.posterImage} />
          <span className={styles.scrim} aria-hidden="true" />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" focusable="false">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className={styles.caption}>Watch the film</span>
        </button>
      )}
    </div>
  );
}
