"use client";

import { motion } from "framer-motion";
import type { DaySceneKey } from "@/lib/assessmentData";
import styles from "./DaySceneArt.module.css";

/**
 * Gently animated illustration for each scene of "One Ordinary Monday".
 * Same lavender-dream palette as SceneArt, but themed to a real day:
 * bedroom, bus stop, commute, office, cafe, desk, phone, rain, dinner,
 * home, night.
 */
export default function DaySceneArt({ scene }: { scene: DaySceneKey }) {
  return (
    <div className={styles.frame}>
      <div className={`${styles.sky} ${styles[scene]}`} />

      {/* sun for daytime scenes / moon for night */}
      {scene !== "night" && scene !== "home" && (
        <motion.div
          className={styles.orb}
          animate={{ y: [0, -8, 0], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {(scene === "night" || scene === "home") && (
        <motion.div
          className={styles.moon}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* stars at night */}
      {scene === "night" &&
        STARS.map((s, i) => (
          <motion.span
            key={i}
            className={styles.star}
            style={{ left: s.l, top: s.t }}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
          />
        ))}

      {/* rain streaks */}
      {scene === "rain" &&
        RAIN.map((r, i) => (
          <motion.span
            key={i}
            className={styles.drop}
            style={{ left: r.l }}
            animate={{ y: ["-10%", "120%"], opacity: [0, 0.6, 0] }}
            transition={{ duration: r.d, repeat: Infinity, delay: r.delay, ease: "linear" }}
          />
        ))}

      <svg viewBox="0 0 600 460" className={styles.svg} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="dHillA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="dHillB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b6a3ef" />
            <stop offset="100%" stopColor="#8b6df0" />
          </linearGradient>
          <linearGradient id="dWarm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe9c4" />
            <stop offset="100%" stopColor="#f5c98a" />
          </linearGradient>
        </defs>

        {scene === "morning" && <Morning />}
        {scene === "busstop" && <BusStop />}
        {scene === "commute" && <Commute />}
        {scene === "office" && <Office />}
        {scene === "lunch" && <Lunch />}
        {scene === "desk" && <Desk />}
        {scene === "phone" && <Phone />}
        {scene === "rain" && <RainScene />}
        {scene === "dinner" && <Dinner />}
        {scene === "home" && <Home />}
        {scene === "night" && <Night />}
      </svg>

      <div className={styles.vignette} />
    </div>
  );
}

/* ---- bedroom, early light through the window ---- */
function Morning() {
  return (
    <>
      <path d="M0 300 Q150 285 320 295 T600 288 V460 H0 Z" fill="url(#dHillA)" opacity="0.35" />
      {/* window frame with warm light */}
      <rect x="70" y="120" width="180" height="150" rx="10" fill="#fff" opacity="0.5" />
      <rect x="82" y="132" width="156" height="126" rx="6" fill="url(#dWarm)" opacity="0.55" />
      <line x1="160" y1="132" x2="160" y2="258" stroke="#fff" strokeWidth="4" opacity="0.7" />
      <line x1="82" y1="195" x2="238" y2="195" stroke="#fff" strokeWidth="4" opacity="0.7" />
      {/* bed */}
      <rect x="300" y="330" width="270" height="90" rx="18" fill="url(#dHillB)" opacity="0.85" />
      <rect x="300" y="300" width="90" height="50" rx="14" fill="#efe7fb" opacity="0.9" />
      <path d="M300 360 h270" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
    </>
  );
}

/* ---- bus stop in the drizzle ---- */
function BusStop() {
  return (
    <>
      <path d="M0 330 H600 V460 H0 Z" fill="url(#dHillA)" opacity="0.5" />
      {/* shelter */}
      <rect x="120" y="180" width="220" height="14" rx="6" fill="url(#dHillB)" />
      <rect x="128" y="194" width="10" height="140" rx="4" fill="#8b6df0" opacity="0.8" />
      <rect x="322" y="194" width="10" height="140" rx="4" fill="#8b6df0" opacity="0.8" />
      <rect x="150" y="250" width="150" height="80" rx="8" fill="#fff" opacity="0.35" />
      {/* bus leaving, right */}
      <motion.g animate={{ x: [0, 40, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}>
        <rect x="430" y="250" width="150" height="80" rx="14" fill="url(#dHillB)" />
        <rect x="446" y="266" width="120" height="34" rx="6" fill="#efe7fb" opacity="0.8" />
        <circle cx="465" cy="336" r="12" fill="#5a4790" />
        <circle cx="545" cy="336" r="12" fill="#5a4790" />
        <rect x="560" y="300" width="16" height="10" rx="3" fill="#ffd59e" />
      </motion.g>
    </>
  );
}

/* ---- inside the bus, foggy window ---- */
function Commute() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#dHillA)" opacity="0.25" />
      {/* window */}
      <rect x="150" y="90" width="300" height="220" rx="20" fill="#efe7fb" opacity="0.55" />
      <rect x="150" y="90" width="300" height="220" rx="20" fill="none" stroke="#8b6df0" strokeWidth="8" opacity="0.6" />
      {/* passing hills through glass */}
      <motion.path
        d="M170 250 Q240 210 320 240 T440 235 V300 H170 Z"
        fill="url(#dHillB)"
        opacity="0.5"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* fog streak + drip */}
      <motion.line x1="200" y1="140" x2="400" y2="140" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.4" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 6, repeat: Infinity }} />
      <rect x="330" y="120" width="6" height="70" rx="3" fill="#fff" opacity="0.3" />
    </>
  );
}

/* ---- office: podium + big presentation screen ---- */
function Office() {
  return (
    <>
      <path d="M0 320 H600 V460 H0 Z" fill="url(#dHillA)" opacity="0.5" />
      {/* screen */}
      <rect x="140" y="90" width="320" height="180" rx="14" fill="#efe7fb" opacity="0.85" />
      <rect x="140" y="90" width="320" height="180" rx="14" fill="none" stroke="#8b6df0" strokeWidth="6" opacity="0.5" />
      {/* bars on the slide */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={180 + i * 68}
          width="40"
          rx="5"
          fill="url(#dHillB)"
          initial={{ height: 0, y: 230 }}
          animate={{ height: [30, 90, 60, 110][i], y: 230 - [30, 90, 60, 110][i] }}
          transition={{ duration: 1.2, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
      {/* podium + speaker */}
      <rect x="290" y="330" width="20" height="70" rx="6" fill="#8b6df0" />
      <circle cx="300" cy="315" r="16" fill="url(#dHillB)" />
      <rect x="270" y="395" width="60" height="14" rx="6" fill="url(#dHillA)" />
    </>
  );
}

/* ---- cafe / lunch table with cups ---- */
function Lunch() {
  return (
    <>
      <path d="M0 300 Q150 288 320 296 T600 290 V460 H0 Z" fill="url(#dHillA)" opacity="0.4" />
      {/* table */}
      <rect x="120" y="300" width="360" height="26" rx="10" fill="url(#dHillB)" opacity="0.9" />
      <rect x="150" y="326" width="14" height="90" rx="5" fill="#8b6df0" opacity="0.7" />
      <rect x="436" y="326" width="14" height="90" rx="5" fill="#8b6df0" opacity="0.7" />
      {/* two cups with rising steam */}
      {[220, 360].map((x, i) => (
        <g key={i}>
          <rect x={x - 22} y="262" width="44" height="38" rx="8" fill="#efe7fb" />
          <path d={`M${x + 22} 270 q18 6 0 24`} stroke="#efe7fb" strokeWidth="6" fill="none" />
          <motion.path
            d={`M${x - 6} 250 q8 -14 0 -28`}
            stroke="#fff"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -6, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        </g>
      ))}
    </>
  );
}

/* ---- desk alone: monitor + chair, blue light ---- */
function Desk() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#dHillA)" opacity="0.2" />
      <rect x="140" y="120" width="320" height="150" rx="12" fill="#efe7fb" opacity="0.85" />
      <rect x="140" y="120" width="320" height="150" rx="12" fill="none" stroke="#8b6df0" strokeWidth="6" opacity="0.45" />
      {/* glowing screen lines */}
      {[150, 178, 206].map((y, i) => (
        <motion.rect key={i} x="168" y={y} width={220 - i * 40} height="10" rx="5" fill="url(#dHillB)" opacity="0.6" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 3 + i, repeat: Infinity }} />
      ))}
      <rect x="290" y="270" width="20" height="40" fill="#8b6df0" opacity="0.7" />
      <rect x="250" y="310" width="100" height="16" rx="6" fill="url(#dHillB)" />
      {/* chair back */}
      <rect x="270" y="330" width="60" height="80" rx="16" fill="url(#dHillA)" opacity="0.8" />
    </>
  );
}

/* ---- evening phone call, glowing screen ---- */
function Phone() {
  return (
    <>
      <path d="M0 320 H600 V460 H0 Z" fill="url(#dHillB)" opacity="0.4" />
      <motion.g animate={{ y: [0, -8, 0], rotate: [0, 1.5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "300px 230px" }}>
        <rect x="248" y="120" width="104" height="200" rx="22" fill="#efe7fb" />
        <rect x="248" y="120" width="104" height="200" rx="22" fill="none" stroke="#8b6df0" strokeWidth="5" opacity="0.5" />
        {/* call glow */}
        <motion.circle cx="300" cy="200" r="26" fill="url(#dWarm)" animate={{ r: [22, 30, 22], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.4, repeat: Infinity }} />
        <path d="M290 194 q10 -10 20 0 q4 8 -4 14 q-8 4 -16 -4 z" fill="#8b6df0" opacity="0.8" />
      </motion.g>
      {/* ring waves */}
      {[1, 2].map((i) => (
        <motion.circle key={i} cx="300" cy="200" r="60" fill="none" stroke="#c4b5fd" strokeWidth="3" animate={{ r: [40, 120], opacity: [0.5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 1.2 }} />
      ))}
    </>
  );
}

/* ---- rain on the street, puddle + streetlight ---- */
function RainScene() {
  return (
    <>
      <path d="M0 340 H600 V460 H0 Z" fill="url(#dHillB)" opacity="0.55" />
      {/* streetlight */}
      <rect x="150" y="150" width="10" height="200" rx="4" fill="#5a4790" opacity="0.7" />
      <motion.circle cx="155" cy="150" r="20" fill="url(#dWarm)" animate={{ opacity: [0.5, 0.85, 0.5] }} transition={{ duration: 4, repeat: Infinity }} />
      {/* puddle reflection */}
      <ellipse cx="300" cy="410" rx="240" ry="26" fill="#efe7fb" opacity="0.35" />
      <motion.ellipse cx="300" cy="410" rx="90" ry="10" fill="#fff" opacity="0.25" animate={{ rx: [80, 110, 80] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
}

/* ---- warm family dinner, table + hanging lamp ---- */
function Dinner() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#dHillA)" opacity="0.25" />
      {/* hanging lamp with warm pool of light */}
      <line x1="300" y1="60" x2="300" y2="120" stroke="#8b6df0" strokeWidth="4" opacity="0.7" />
      <path d="M270 120 h60 l-14 26 h-32 z" fill="url(#dHillB)" />
      <motion.ellipse cx="300" cy="300" rx="180" ry="120" fill="url(#dWarm)" opacity="0.28" animate={{ opacity: [0.2, 0.34, 0.2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      {/* round table */}
      <ellipse cx="300" cy="360" rx="210" ry="52" fill="url(#dHillB)" opacity="0.9" />
      <ellipse cx="300" cy="352" rx="180" ry="40" fill="#efe7fb" opacity="0.55" />
      {/* plates */}
      {[190, 300, 410].map((x, i) => (
        <ellipse key={i} cx={x} cy="352" rx="30" ry="10" fill="#fff" opacity="0.6" />
      ))}
    </>
  );
}

/* ---- quiet apartment at night, sofa + window ---- */
function Home() {
  return (
    <>
      <rect x="0" y="0" width="600" height="460" fill="url(#dHillB)" opacity="0.35" />
      {/* window with night sky */}
      <rect x="330" y="90" width="200" height="160" rx="10" fill="#3b2f66" opacity="0.5" />
      <rect x="330" y="90" width="200" height="160" rx="10" fill="none" stroke="#8b6df0" strokeWidth="6" opacity="0.5" />
      <circle cx="470" cy="140" r="18" fill="#efe7fb" opacity="0.85" />
      {/* sofa */}
      <rect x="70" y="300" width="240" height="70" rx="18" fill="url(#dHillA)" opacity="0.9" />
      <rect x="70" y="270" width="240" height="46" rx="16" fill="url(#dHillB)" opacity="0.85" />
      <rect x="60" y="290" width="34" height="80" rx="12" fill="url(#dHillB)" />
      <rect x="286" y="290" width="34" height="80" rx="12" fill="url(#dHillB)" />
    </>
  );
}

/* ---- bedroom at night, moonlight ---- */
function Night() {
  return (
    <>
      <path d="M0 320 Q150 305 320 315 T600 308 V460 H0 Z" fill="url(#dHillB)" opacity="0.5" />
      {/* bed */}
      <rect x="150" y="330" width="300" height="90" rx="18" fill="url(#dHillA)" opacity="0.85" />
      <rect x="150" y="300" width="100" height="52" rx="14" fill="#d9cdf5" opacity="0.8" />
      <path d="M150 362 h300" stroke="#fff" strokeOpacity="0.25" strokeWidth="3" />
      {/* soft moonlight beam */}
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
  { l: "44%", t: "10%", d: 3.8, delay: 1.4 },
];

const RAIN = Array.from({ length: 14 }, (_, i) => ({
  l: `${6 + i * 6.6}%`,
  d: 0.8 + (i % 4) * 0.25,
  delay: (i % 7) * 0.2,
}));
