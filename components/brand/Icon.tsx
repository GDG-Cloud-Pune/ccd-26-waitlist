export type IconName = "arrow-right" | "move-horizontal" | "plus" | "flip";

const PATHS: Record<IconName, string> = {
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  "move-horizontal": "M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4",
  plus: "M12 5v14M5 12h14",
  flip: "M21 12a9 9 0 1 1-2.6-6.4M21 4v5h-5",
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
