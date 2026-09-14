import type { ReactNode } from "react";
import styles from "./brand.module.css";

type PillProps = {
  tone?: "solid" | "ghost";
  className?: string;
  children: ReactNode;
};

export function Pill({ tone = "solid", className, children }: PillProps) {
  return (
    <span className={[styles.pill, className].filter(Boolean).join(" ")} data-tone={tone}>
      {children}
    </span>
  );
}
