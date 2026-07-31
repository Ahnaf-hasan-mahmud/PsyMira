"use client";

import { motion } from "framer-motion";
import type { HomecomingSceneKey } from "@/lib/homecomingData";
import styles from "./HomecomingSceneArt.module.css";

/**
 * Animated illustration for each scene of "The Long Way Home".
 * Follows the same visual language as previous stories but focused on return.
 */
export default function HomecomingSceneArt({ scene }: { scene: HomecomingSceneKey }) {
  const isNightLike = scene === "night" || scene === "window" || scene === "taxi";

  return (
    <div className={styles.frame}>
      <div className={`${styles.sky} ${styles[scene]}`} />

      {/* Sun/Moon */}
      {!isNightLike && scene !== "kitchen" && scene !== "phone" && scene !== "mirror" && (
        <motion.div
          className={styles.orb}
          animate={{ y: [0, -8, 0], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {isNightLike && (
        <motion.div
          className={styles.moon}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Stars at night */}
      {isNightLike &&
        STARS.map((s, i) => (
          <motion.span
            key={i}
            className={styles.star}
            style={{ left: s.l, top: s.t }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

      <svg viewBox="0 0 600 460" className={styles.svg} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="hcHillA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="hcHillB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b6a3ef" />
            <stop offset="100%" stopColor="#8b6df0" />
          </linearGradient>
          <linearGradient id="hcWarm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9c4" />
            <stop offset="100%" stopColor="#f5c98a" />
          </linearGradient>
        </defs>

        {scene === "airport" && <Airport />}
        {scene === "taxi" && <Taxi />}
        {scene === "street" && <Street />}
        {scene === "door" && <Door />}
        {scene === "bedroom" && <Bedroom />}
        {scene === "kitchen" && <Kitchen />}
        {scene === "phone" && <Phone />}
        {scene === "window" && <Window />}
        {scene === "mirror" && <Mirror />}
        {scene === "cafe" && <Cafe />}
        {scene === "night" && <Night />}
      </svg>

      <div className={styles.vignette} />
    </div>
  );
}

function Airport() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillA)" opacity="0.25" />
      {/* Big terminal windows */}
      {[50, 220, 390].map((x, i) => (
        <rect key={i} x={x} y="80" width="150" height="260" rx="20" fill="#efe7fb" opacity="0.4" />
      ))}
      <rect x="0" y="320" width="600" height="140" fill="url(#hcHillB)" opacity="0.6" />
      {/* Lonely figure */}
      <circle cx="300" cy="300" r="14" fill="#8b6df0" />
      <rect x="290" y="320" width="20" height="60" rx="8" fill="url(#hcHillA)" />
      {/* Suitcase */}
      <rect x="330" y="340" width="24" height="40" rx="4" fill="url(#hcHillB)" opacity="0.8" />
      <line x1="342" y1="340" x2="342" y2="330" stroke="#8b6df0" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

function Taxi() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillA)" opacity="0.2" />
      <rect x="120" y="100" width="360" height="240" rx="30" fill="#efe7fb" opacity="0.5" />
      <rect x="120" y="100" width="360" height="240" rx="30" fill="none" stroke="#8b6df0" strokeWidth="8" opacity="0.6" />
      {/* Passing city lights outside window */}
      <motion.g animate={{ x: [0, -100] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
        {[100, 300, 500].map((x, i) => (
          <circle key={i} cx={x} cy="220" r="16" fill="url(#hcWarm)" opacity="0.5" />
        ))}
      </motion.g>
      <rect x="100" y="340" width="400" height="120" rx="20" fill="url(#hcHillB)" opacity="0.8" />
    </>
  );
}

function Street() {
  return (
    <>
      <path d="M0 250 L150 220 L300 240 L450 210 L600 240 V460 H0 Z" fill="url(#hcHillA)" opacity="0.4" />
      <rect x="400" y="150" width="120" height="160" rx="4" fill="url(#hcHillB)" opacity="0.8" />
      <polygon points="380,150 460,80 540,150" fill="url(#hcHillB)" opacity="0.9" />
      <rect x="440" y="180" width="40" height="40" rx="4" fill="url(#hcWarm)" opacity="0.8" />
      {/* Street lamp */}
      <rect x="150" y="120" width="8" height="200" fill="#5a4790" />
      <circle cx="154" cy="120" r="14" fill="url(#hcWarm)" />
      <path d="M0 320 Q300 300 600 340 V460 H0 Z" fill="url(#hcHillB)" opacity="0.7" />
    </>
  );
}

function Door() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillA)" opacity="0.2" />
      {/* Door frame */}
      <rect x="200" y="80" width="200" height="380" fill="url(#hcHillB)" opacity="0.8" />
      <rect x="220" y="100" width="160" height="360" fill="#efe7fb" opacity="0.4" />
      {/* Panels */}
      <rect x="240" y="120" width="120" height="80" rx="6" fill="none" stroke="#8b6df0" strokeWidth="4" opacity="0.5" />
      <rect x="240" y="240" width="120" height="140" rx="6" fill="none" stroke="#8b6df0" strokeWidth="4" opacity="0.5" />
      {/* Handle */}
      <circle cx="230" cy="280" r="8" fill="#5a4790" />
    </>
  );
}

function Bedroom() {
  return (
    <>
      <path d="M0 300 Q150 285 320 295 T600 288 V460 H0 Z" fill="url(#hcHillA)" opacity="0.35" />
      {/* Window */}
      <rect x="100" y="100" width="160" height="140" rx="8" fill="#fff" opacity="0.5" />
      <rect x="110" y="110" width="140" height="120" rx="4" fill="url(#hcWarm)" opacity="0.4" />
      {/* Bed */}
      <rect x="250" y="330" width="300" height="90" rx="18" fill="url(#hcHillB)" opacity="0.85" />
      <rect x="250" y="300" width="100" height="50" rx="14" fill="#efe7fb" opacity="0.9" />
      <path d="M250 360 h300" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
      <rect x="420" y="320" width="100" height="10" rx="5" fill="#8b6df0" opacity="0.4" /> {/* unmade blanket fold */}
    </>
  );
}

function Kitchen() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillA)" opacity="0.2" />
      {/* Fridge open slightly */}
      <rect x="120" y="80" width="140" height="280" rx="10" fill="url(#hcHillB)" opacity="0.8" />
      <rect x="240" y="80" width="40" height="280" rx="4" fill="url(#hcWarm)" opacity="0.6" />
      {/* Counter */}
      <rect x="280" y="280" width="260" height="80" fill="url(#hcHillA)" opacity="0.7" />
      <rect x="280" y="280" width="260" height="16" fill="#efe7fb" />
      {/* One lemon/jar on counter */}
      <ellipse cx="400" cy="270" rx="12" ry="10" fill="#ffd59e" />
      <rect x="440" y="250" width="24" height="30" rx="4" fill="url(#hcHillB)" opacity="0.9" />
    </>
  );
}

function Phone() {
  return (
    <>
      <path d="M0 320 H600 V460 H0 Z" fill="url(#hcHillB)" opacity="0.4" />
      <motion.g animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "300px 230px" }}>
        <rect x="248" y="120" width="104" height="200" rx="22" fill="#efe7fb" />
        <rect x="248" y="120" width="104" height="200" rx="22" fill="none" stroke="#8b6df0" strokeWidth="5" opacity="0.5" />
        {/* Glow */}
        <motion.circle cx="300" cy="200" r="26" fill="url(#hcWarm)" animate={{ r: [22, 30, 22], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }} />
      </motion.g>
    </>
  );
}

function Window() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillB)" opacity="0.35" />
      {/* window with night sky */}
      <rect x="330" y="90" width="200" height="160" rx="10" fill="#3b2f66" opacity="0.5" />
      <rect x="330" y="90" width="200" height="160" rx="10" fill="none" stroke="#8b6df0" strokeWidth="6" opacity="0.5" />
      <circle cx="470" cy="140" r="18" fill="#efe7fb" opacity="0.85" />
      {/* silhouette of person looking out */}
      <rect x="150" y="240" width="60" height="220" rx="30" fill="url(#hcHillB)" />
      <circle cx="180" cy="200" r="34" fill="url(#hcHillB)" />
    </>
  );
}

function Mirror() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#hcHillA)" opacity="0.3" />
      <rect x="200" y="60" width="200" height="280" rx="100" fill="#efe7fb" opacity="0.6" />
      <rect x="200" y="60" width="200" height="280" rx="100" fill="none" stroke="#8b6df0" strokeWidth="10" opacity="0.7" />
      {/* Reflection silhouette */}
      <motion.circle cx="300" cy="200" r="40" fill="url(#hcHillB)" opacity="0.5" animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.rect x="250" y="260" width="100" height="140" rx="40" fill="url(#hcHillB)" opacity="0.5" animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 6, repeat: Infinity }} />
    </>
  );
}

function Cafe() {
  return (
    <>
      <path d="M0 300 Q150 288 320 296 T600 290 V460 H0 Z" fill="url(#hcHillA)" opacity="0.4" />
      {/* table */}
      <ellipse cx="300" cy="350" rx="140" ry="26" fill="url(#hcHillB)" opacity="0.9" />
      <rect x="290" y="376" width="20" height="90" rx="5" fill="#8b6df0" opacity="0.7" />
      {/* One cup */}
      <rect x="280" y="300" width="40" height="40" rx="8" fill="#efe7fb" />
      <motion.path
        d="M290 290 q8 -14 0 -28"
        stroke="#fff"
        strokeWidth="4"
        fill="none"
        opacity="0.5"
        animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

function Night() {
  return (
    <>
      <path d="M0 320 Q150 305 320 315 T600 308 V460 H0 Z" fill="url(#hcHillB)" opacity="0.5" />
      {/* bed */}
      <rect x="150" y="330" width="300" height="90" rx="18" fill="url(#hcHillA)" opacity="0.85" />
      <rect x="150" y="300" width="100" height="52" rx="14" fill="#d9cdf5" opacity="0.8" />
      <path d="M150 362 h300" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
      <motion.path
        d="M470 120 L360 420 L440 420 L540 120 Z"
        fill="#efe7fb"
        opacity="0.12"
        animate={{ opacity: [0.06, 0.16, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

const STARS = [
  { l: "18%", t: "16%", d: 3.2, delay: 0 },
  { l: "72%", t: "12%", d: 4, delay: 0.5 },
  { l: "55%", t: "22%", d: 3.6, delay: 1 },
  { l: "32%", t: "28%", d: 4.2, delay: 0.3 },
  { l: "84%", t: "26%", d: 3, delay: 0.8 },
];
