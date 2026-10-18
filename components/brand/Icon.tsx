export type IconName = "arrow-right" | "arrow-down" | "move-horizontal" | "plus";

const PATHS: Record<IconName, string> = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "arrow-down": "M12 5v14M6 13l6 6 6-6",
  "move-horizontal": "M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4",
  plus: "M12 5v14M5 12h14",
};

/** Line icons drawn in currentColor, matching the 2px stroke of the social icons. */
export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ flex: "none" }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
