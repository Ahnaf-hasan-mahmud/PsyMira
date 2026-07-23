"use client";

import type { TooltipProps } from "recharts";
import styles from "./ChartTooltip.module.css";

/** Shared frosted tooltip so every chart speaks the same calm language. */
export default function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: TooltipProps<number, string> & { unit?: string }) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className={styles.tip}>
      {label != null && <p className={styles.label}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className={styles.row}>
          <span
            className={styles.dot}
            style={{ background: (p.color as string) || "#a78bfa" }}
          />
          <span className={styles.name}>{p.name}</span>
          <span className={styles.value}>
            {p.value}
            {unit}
          </span>
        </p>
      ))}
    </div>
  );
}
