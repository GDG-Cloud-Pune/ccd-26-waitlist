import Image from "next/image";
import styles from "./PhotoSlot.module.css";

type PhotoSlotProps = {
  /** Real photo once available; until then a neutral silhouette is drawn. */
  src?: string;
  alt?: string;
  /** Shown under the silhouette, e.g. "Speaker photo" or a gallery caption. */
  label?: string;
  sizes?: string;
  className?: string;
};

export function PhotoSlot({ src, alt = "", label, sizes = "(max-width: 900px) 100vw, 320px", className }: PhotoSlotProps) {
  if (src) {
    return (
      <div className={[styles.slot, className].filter(Boolean).join(" ")}>
        <Image src={src} alt={alt} fill sizes={sizes} className={styles.image} />
      </div>
    );
  }

  return (
    <div className={[styles.slot, className].filter(Boolean).join(" ")} role="img" aria-label={label || "Photo coming soon"}>
      <svg viewBox="0 0 64 64" className={styles.silhouette} aria-hidden="true" focusable="false">
        <circle cx="32" cy="24" r="11" />
        <path d="M11 57a21 21 0 0 1 42 0z" />
      </svg>
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
