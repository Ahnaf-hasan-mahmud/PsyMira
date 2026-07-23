"use client";

import { motion } from "framer-motion";
import { EMOTION_META, type Emotion } from "@/lib/storyData";
import styles from "./EmotionWheel.module.css";

type Datum = { emotion: Emotion; value: number };

/**
 * A soft radial "emotion wheel" — five spokes whose reach reflects
 * how strongly each feeling showed up. No numbers, just shape & colour.
 */
export default function EmotionWheel({
  data,
  size = 280,
}: {
  data: Datum[];
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 46;
  const max = Math.max(...data.map((d) => d.value), 1);
  const n = data.length;

  // point on a spoke, scaled 0..1 outward
  const point = (i: number, scale: number) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * scale,
      y: cy + Math.sin(angle) * radius * scale,
    };
  };

  const polygon = data
    .map((d, i) => {
      const p = point(i, 0.25 + (d.value / max) * 0.75);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className={styles.wrap} style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <defs>
          <radialGradient id="wheelFill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        {/* concentric guide rings */}
        {[0.4, 0.7, 1].map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={radius * r}
            fill="none"
            stroke="#e7e0ef"
            strokeWidth="1"
          />
        ))}

        {/* spokes */}
        {data.map((_, i) => {
          const p = point(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#ece6f5"
              strokeWidth="1"
            />
          );
        })}

        {/* the shape */}
        <motion.polygon
          points={polygon}
          fill="url(#wheelFill)"
          stroke="#8b6df0"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* vertices */}
        {data.map((d, i) => {
          const p = point(i, 0.25 + (d.value / max) * 0.75);
          return (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="5"
              fill={EMOTION_META[d.emotion].color}
              stroke="#fff"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            />
          );
        })}
      </svg>

      {/* labels around the wheel */}
      {data.map((d, i) => {
        const p = point(i, 1.2);
        return (
          <motion.span
            key={d.emotion}
            className={styles.label}
            style={{
              left: p.x,
              top: p.y,
              color: EMOTION_META[d.emotion].color,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 + i * 0.08 }}
          >
            {EMOTION_META[d.emotion].label}
          </motion.span>
        );
      })}
    </div>
  );
}
