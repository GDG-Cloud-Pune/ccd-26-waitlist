import styles from "./brand.module.css";

const COLORS = ["var(--blue)", "var(--green)", "var(--yellow)", "var(--red)"];

export function ColorBar({ className }: { className?: string }) {
  return (
    <div className={[styles.colorBar, className].filter(Boolean).join(" ")} aria-hidden="true">
      {COLORS.map((color) => (
        <span key={color} style={{ background: color }} />
      ))}
    </div>
  );
}
