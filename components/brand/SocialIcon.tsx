export type SocialIconName = "instagram" | "linkedin" | "x";

// Line icons in currentColor, stroked to match the outlined poster style.
export function SocialIcon({ name }: { name: SocialIconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {name === "instagram" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </>
      )}
      {name === "linkedin" && (
        <>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 10.5V17" />
          <circle cx="8" cy="7.25" r="0.6" fill="currentColor" />
          <path d="M12 17v-6.5M12 13.25a2.75 2.75 0 0 1 5.5 0V17" />
        </>
      )}
      {name === "x" && (
        <>
          <path d="M4 4h4.2L20 20h-4.2z" />
          <path d="M19.5 4l-6.2 7.1M4.5 20l6.2-7.1" />
        </>
      )}
    </svg>
  );
}
