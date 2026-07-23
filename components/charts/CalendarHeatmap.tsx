"use client";

import { motion } from "framer-motion";
import { heatmap } from "@/lib/sampleData";
import styles from "./CalendarHeatmap.module.css";

const LEVELS = ["#f0ebf8", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b6df0"];
const DAY_LABELS = ["M", "", "W", "", "F", "", "S"];

/** GitHub-style calendar of reflection intensity, in lavender tones. */
export default function CalendarHeatmap({
  data = heatmap,
}: {
  data?: number[][];
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.grid}>
        <div className={styles.dayCol} aria-hidden="true">
          {DAY_LABELS.map((d, i) => (
            <span key={i} className={styles.dayLabel}>
              {d}
            </span>
          ))}
        </div>
        <div className={styles.weeks}>
          {data.map((week, wi) => (
            <div key={wi} className={styles.week}>
              {week.map((lvl, di) => (
                <motion.span
                  key={di}
                  className={styles.cell}
                  style={{ background: LEVELS[lvl] }}
                  title={`${lvl} reflection${lvl === 1 ? "" : "s"}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.3,
                    delay: (wi * 7 + di) * 0.004,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.legend}>
        <span>Less</span>
        {LEVELS.map((c, i) => (
          <span
            key={i}
            className={styles.legendCell}
            style={{ background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
