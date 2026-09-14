import { SocialIcon } from "@/components/brand/SocialIcon";
import { SOCIAL_LINKS } from "@/lib/socials";
import styles from "./SocialLinks.module.css";

type SocialLinksProps = {
  /** "pill" shows icon + name; "icon" is a compact round button with an accessible label. */
  variant?: "pill" | "icon";
  className?: string;
};

export function SocialLinks({ variant = "pill", className }: SocialLinksProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(" ")}>
      {SOCIAL_LINKS.map(({ name, href, icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={variant === "icon" ? styles.icon : styles.pill}
            aria-label={variant === "icon" ? `GDG Cloud Pune on ${name} (opens in a new tab)` : undefined}
          >
            <SocialIcon name={icon} />
            {variant === "pill" && (
              <>
                <span>{name}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
