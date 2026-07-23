"use client";

import { motion } from "framer-motion";
import ParticleField from "./ParticleField";
import styles from "./HeroScene.module.css";

/**
 * The hero centerpiece: a glowing purple tree breathing slowly,
 * a floating companion spirit, drifting stars, soft clouds and motes.
 * Everything animated, nothing aggressive.
 */
export default function HeroScene() {
  return (
    <div className={styles.scene} aria-hidden="true">
      {/* aura glow behind everything */}
      <div className={styles.aura} />

      {/* drifting motes */}
      <ParticleField count={38} className={styles.particles} />

      {/* soft clouds */}
      <motion.div
        className={`${styles.cloud} ${styles.cloud1}`}
        animate={{ x: [0, 18, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.cloud} ${styles.cloud2}`}
        animate={{ x: [0, -22, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* twinkling stars */}
      {STARS.map((s, i) => (
        <motion.span
          key={i}
          className={styles.star}
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.15, 0.8] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* the tree — gently breathing */}
      <motion.div
        className={styles.treeWrap}
        animate={{ scale: [1, 1.025, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 320 360" className={styles.tree} fill="none">
          <defs>
            <radialGradient id="canopy" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#ddd6fe" />
              <stop offset="55%" stopColor="#c4b5fd" />
              <stop offset="100%" stopColor="#a78bfa" />
            </radialGradient>
            <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b9a7e8" />
              <stop offset="100%" stopColor="#8b6df0" />
            </linearGradient>
            <radialGradient id="leafGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ddd6fe" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* trunk + roots */}
          <path
            d="M160 360c-6-44-6-86-4-128 1-22 3-40 4-54 1 14 3 32 4 54 2 42 2 84-4 128Z"
            fill="url(#trunk)"
          />
          <path
            d="M158 250c-14 10-26 14-44 16M162 250c14 10 26 14 44 16"
            stroke="url(#trunk)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* canopy clusters */}
          <g>
            <circle cx="160" cy="120" r="78" fill="url(#canopy)" />
            <circle cx="104" cy="150" r="50" fill="url(#canopy)" />
            <circle cx="216" cy="150" r="50" fill="url(#canopy)" />
            <circle cx="160" cy="74" r="46" fill="url(#canopy)" />
          </g>

          {/* glowing leaf-lights */}
          {LEAVES.map((l, i) => (
            <g key={i}>
              <circle cx={l.x} cy={l.y} r="11" fill="url(#leafGlow)" />
              <circle cx={l.x} cy={l.y} r="3.4" fill="#fff" />
            </g>
          ))}
        </svg>

        {/* pulsing light at the canopy core */}
        <motion.div
          className={styles.coreGlow}
          animate={{ opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* floating companion spirit */}
      <motion.div
        className={styles.spirit}
        animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 80 96" fill="none">
          <defs>
            <radialGradient id="spiritBody" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#ede9fe" />
              <stop offset="100%" stopColor="#c4b5fd" />
            </radialGradient>
          </defs>
          {/* wisp body */}
          <path
            d="M40 6c19 0 30 15 30 34 0 16-7 28-7 38 0 6-4 10-9 10-4 0-6-3-7-7-1 4-3 7-7 7s-6-3-7-7c-1 4-3 7-7 7-5 0-9-4-9-10 0-10-7-22-7-38C10 21 21 6 40 6Z"
            fill="url(#spiritBody)"
          />
          {/* eyes */}
          <circle cx="31" cy="40" r="3.4" fill="#2b2930" />
          <circle cx="49" cy="40" r="3.4" fill="#2b2930" />
          {/* blush */}
          <ellipse cx="26" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.5" />
          <ellipse cx="54" cy="50" rx="5" ry="3" fill="#f9a8d4" opacity="0.5" />
        </svg>
        <motion.div
          className={styles.spiritHalo}
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* base shadow / ground glow */}
      <div className={styles.ground} />
    </div>
  );
}

const STARS = [
  { left: "12%", top: "16%", size: 7, dur: 3.4, delay: 0 },
  { left: "82%", top: "12%", size: 9, dur: 4.2, delay: 0.6 },
  { left: "68%", top: "26%", size: 6, dur: 3.0, delay: 1.1 },
  { left: "20%", top: "44%", size: 5, dur: 3.8, delay: 0.3 },
  { left: "88%", top: "52%", size: 7, dur: 4.6, delay: 0.9 },
  { left: "8%", top: "62%", size: 6, dur: 3.2, delay: 1.4 },
  { left: "74%", top: "70%", size: 8, dur: 4.0, delay: 0.2 },
];

const LEAVES = [
  { x: 130, y: 96 },
  { x: 188, y: 104 },
  { x: 160, y: 66 },
  { x: 110, y: 140 },
  { x: 210, y: 142 },
  { x: 150, y: 150 },
  { x: 180, y: 80 },
];
