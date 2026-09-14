export const CLOUD_PATH =
  "M30 70 H95 A20 20 0 0 0 95 30 A25 25 0 0 0 48 22 A18 18 0 0 0 30 34 A18 18 0 0 0 30 70 Z";

type CloudMarkProps = {
  fill?: string;
  className?: string;
};

export function CloudMark({ fill = "var(--blue)", className }: CloudMarkProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" focusable="false">
      <path d={CLOUD_PATH} fill={fill} stroke="var(--outline)" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
}
