"use client";

/* ============================================================
   Timer — sleep timer chips (15 / 30 / 45 / 60 min). Selecting
   one arms the countdown; playback fades out smoothly before it
   stops. Selecting the active chip again clears the timer.
   ============================================================ */

import { motion } from "framer-motion";
import { Clock } from "@/components/ui/Icons";
import type { TimerMinutes } from "@/lib/useRelaxationPlayer";
import { fadeUp } from "@/lib/motion";
import styles from "./Timer.module.css";

const OPTIONS: TimerMinutes[] = [15, 30, 45, 60];

function fmtRemaining(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  active: TimerMinutes | null;
  remaining: number | null;
  fading: boolean;
  onSelect: (minutes: TimerMinutes | null) => void;
};

export default function Timer({ active, remaining, fading, onSelect }: Props) {
  return (
    <motion.section variants={fadeUp} className={styles.wrap} aria-label="Sleep timer">
      <div className={styles.head}>
        <span className={styles.eyebrow}>
          <Clock size={16} /> Sleep timer
        </span>
        {active != null && remaining != null && (
          <span className={styles.remaining} aria-live="polite">
            {fading ? "Fading out…" : `${fmtRemaining(remaining)} left`}
          </span>
        )}
      </div>

      <p className={styles.lede}>
        Let the sound stop itself. Playback fades out gently when the timer ends.
      </p>

      <div className={styles.chips} role="group" aria-label="Timer duration">
        {OPTIONS.map((minutes) => {
          const on = active === minutes;
          return (
            <motion.button
              key={minutes}
              type="button"
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              className={`${styles.chip} ${on ? styles.chipOn : ""}`}
              onClick={() => onSelect(on ? null : minutes)}
              aria-pressed={on}
              aria-label={`${minutes} minute timer`}
            >
              {minutes}
              <span className={styles.min}>min</span>
            </motion.button>
          );
        })}
        {active != null && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            className={styles.clear}
            onClick={() => onSelect(null)}
            aria-label="Clear timer"
          >
            Clear
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}
