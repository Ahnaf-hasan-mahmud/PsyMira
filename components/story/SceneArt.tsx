"use client";

import { motion } from "framer-motion";
import type { SceneKey } from "@/lib/storyData";
import styles from "./SceneArt.module.css";

/**
 * Stylised, gently animated illustration for each story scene.
 * Shares a soft lavender palette so transitions feel like one dream.
 */
export default function SceneArt({ scene }: { scene: SceneKey }) {
  return (
    <div className={styles.frame}>
      <div className={`${styles.sky} ${styles[scene]}`} />

      {/* floating orb (sun / moon) */}
      <motion.div
        className={styles.orb}
        animate={{ y: [0, -10, 0], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* drifting stars for darker scenes */}
      {(scene === "path" || scene === "lake") &&
        STARS.map((s, i) => (
          <motion.span
            key={i}
            className={styles.star}
            style={{ left: s.l, top: s.t }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: s.d,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      <svg
        viewBox="0 0 600 460"
        className={styles.svg}
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hillA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b6a3ef" />
            <stop offset="100%" stopColor="#8b6df0" />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d9cdfa" />
            <stop offset="100%" stopColor="#b69df3" />
          </linearGradient>
        </defs>

        {scene === "lake" && <Lake />}
        {scene === "forest" && <Forest />}
        {scene === "path" && <Path />}
        {scene === "summit" && <Summit />}
        {scene === "dawn" && <Dawn />}
      </svg>

      <div className={styles.vignette} />
    </div>
  );
}

function Lake() {
  return (
    <>
      <path d="M0 250 Q150 210 320 240 T600 230 V460 H0 Z" fill="url(#hillA)" opacity="0.55" />
      <ellipse cx="300" cy="380" rx="320" ry="80" fill="url(#water)" />
      {/* still reflections */}
      {[330, 350, 370, 392].map((y, i) => (
        <motion.line
          key={i}
          x1={180 + i * 18}
          x2={420 - i * 18}
          y1={y}
          y2={y}
          stroke="#fff"
          strokeOpacity="0.35"
          strokeWidth="2"
          animate={{ strokeOpacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function Forest() {
  const trees = [60, 130, 210, 300, 390, 470, 540];
  return (
    <>
      <path d="M0 280 Q150 250 320 270 T600 260 V460 H0 Z" fill="url(#hillA)" opacity="0.4" />
      {trees.map((x, i) => (
        <motion.g
          key={i}
          animate={{ rotate: [0, i % 2 ? 1.2 : -1.2, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${x}px 460px` }}
        >
          <path
            d={`M${x} 460 L${x} 300`}
            stroke="#8b6df0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={`M${x} 300 l-34 70 h68 Z`}
            fill="url(#hillB)"
            opacity={0.85 - i * 0.05}
          />
          <path
            d={`M${x} 330 l-28 58 h56 Z`}
            fill="url(#hillA)"
            opacity={0.9 - i * 0.04}
          />
        </motion.g>
      ))}
    </>
  );
}

function Path() {
  return (
    <>
      <path d="M0 270 Q160 230 330 250 T600 240 V460 H0 Z" fill="url(#hillB)" opacity="0.5" />
      {/* winding path */}
      <path
        d="M300 460 Q280 380 320 320 T300 250"
        stroke="#efe7fb"
        strokeWidth="46"
        strokeLinecap="round"
        opacity="0.55"
        fill="none"
      />
      <path d="M0 300 Q150 280 320 295 T600 285 V460 H0 Z" fill="url(#hillA)" opacity="0.7" />
      {/* lantern glow */}
      <motion.circle
        cx="360"
        cy="300"
        r="14"
        fill="#ffe9a8"
        animate={{ opacity: [0.5, 1, 0.5], r: [12, 16, 12] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function Summit() {
  return (
    <>
      <path d="M0 320 L150 200 L300 300 L450 180 L600 290 V460 H0 Z" fill="url(#hillB)" opacity="0.5" />
      <path d="M0 360 L180 260 L360 350 L600 250 V460 H0 Z" fill="url(#hillA)" opacity="0.8" />
      {/* clouds below */}
      {[120, 360].map((x, i) => (
        <motion.ellipse
          key={i}
          cx={x}
          cy={360 + i * 14}
          rx="90"
          ry="18"
          fill="#fff"
          opacity="0.4"
          animate={{ cx: [x, x + 24, x] }}
          transition={{ duration: 16 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

function Dawn() {
  return (
    <>
      <path d="M0 300 Q150 270 320 285 T600 275 V460 H0 Z" fill="url(#hillA)" opacity="0.55" />
      <path d="M0 350 Q160 320 330 335 T600 325 V460 H0 Z" fill="url(#hillB)" opacity="0.85" />
      {/* sun rays */}
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.line
          key={i}
          x1="300"
          y1="150"
          x2={300 + Math.cos((i / 7) * Math.PI - Math.PI) * 200}
          y2={150 + Math.sin((i / 7) * Math.PI - Math.PI) * 200}
          stroke="#ffe9a8"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </>
  );
}

const STARS = [
  { l: "16%", t: "18%", d: 3.2, delay: 0 },
  { l: "74%", t: "14%", d: 4, delay: 0.5 },
  { l: "58%", t: "26%", d: 3.6, delay: 1 },
  { l: "30%", t: "32%", d: 4.2, delay: 0.3 },
  { l: "86%", t: "30%", d: 3, delay: 0.8 },
];
