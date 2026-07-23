"use client";

import { motion } from "framer-motion";
import styles from "./GrowthTree.module.css";

/**
 * A breathing growth tree whose canopy fills out with `level` (0–5).
 * Used in the dashboard journey + landing preview.
 */
export default function GrowthTree({
  level = 4,
  size = 200,
}: {
  level?: number;
  size?: number;
}) {
  // canopy clusters revealed progressively by level
  const clusters = [
    { cx: 100, cy: 78, r: 30 },
    { cx: 74, cy: 96, r: 24 },
    { cx: 126, cy: 96, r: 24 },
    { cx: 100, cy: 56, r: 22 },
    { cx: 100, cy: 100, r: 30 },
  ];
  const shown = Math.max(1, Math.min(5, level));

  return (
    <motion.div
      className={styles.wrap}
      style={{ width: size, height: size }}
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 210" fill="none">
        <defs>
          <radialGradient id="gtCanopy" cx="50%" cy="40%" r="62%">
            <stop offset="0%" stopColor="#ddd6fe" />
            <stop offset="60%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </radialGradient>
          <linearGradient id="gtTrunk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bdaceb" />
            <stop offset="100%" stopColor="#8b6df0" />
          </linearGradient>
        </defs>

        {/* soft mound */}
        <ellipse cx="100" cy="196" rx="64" ry="12" fill="#efeafc" />

        {/* trunk */}
        <path
          d="M100 200c-4-30-4-58-3-86 0-10 1-18 3-26 2 8 3 16 3 26 1 28 1 56-3 86Z"
          fill="url(#gtTrunk)"
        />

        {/* canopy clusters, revealed by level */}
        {clusters.slice(0, shown).map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={c.r}
            fill="url(#gtCanopy)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.15 * i,
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
          />
        ))}

        {/* glints */}
        {shown >= 3 &&
          [
            [86, 82],
            [114, 90],
            [100, 66],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill="#fff" opacity="0.9" />
          ))}
      </svg>

      <motion.span
        className={styles.glow}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
