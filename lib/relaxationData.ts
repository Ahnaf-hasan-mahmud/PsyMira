/* ============================================================
   PsyMira — Relaxation soundscapes.
   Five ambient tracks tuned to lower stress, sharpen focus and
   ease you toward rest. Audio files live in /public/audio and
   loop seamlessly; `preload="none"` keeps them off the wire
   until a track is actually played.
   ============================================================ */

export type SoundId = "rain" | "ocean" | "forest" | "fireplace" | "crickets";

export type Soundscape = {
  id: SoundId;
  title: string;
  emoji: string;
  description: string;
  /** path under /public */
  src: string;
  /** accent used for the card gradient + controls */
  accent: string;
  accentSoft: string;
  /** two-stop gradient for the thumbnail */
  gradient: string;
};

export const SOUNDSCAPES: Soundscape[] = [
  {
    id: "rain",
    title: "Rain",
    emoji: "🌧",
    description: "Gentle rainfall to reduce stress and improve focus.",
    src: "/audio/rain.mp3",
    accent: "#7c8db5",
    accentSoft: "#cdd6ea",
    gradient: "linear-gradient(150deg, #6b7fb0 0%, #98a9cf 55%, #cdd6ea 100%)",
  },
  {
    id: "ocean",
    title: "Ocean Waves",
    emoji: "🌊",
    description: "Calming sea waves for mindfulness and relaxation.",
    src: "/audio/ocean.mp3",
    accent: "#3a9bb0",
    accentSoft: "#bfe6ec",
    gradient: "linear-gradient(150deg, #2f8fa8 0%, #6cc0cf 55%, #bfe6ec 100%)",
  },
  {
    id: "forest",
    title: "Forest Birds",
    emoji: "🌲",
    description: "Peaceful forest ambience with birds singing.",
    src: "/audio/forest.mp3",
    accent: "#5a9d6b",
    accentSoft: "#cbe7cf",
    gradient: "linear-gradient(150deg, #4c8f5e 0%, #82bd8f 55%, #cbe7cf 100%)",
  },
  {
    id: "fireplace",
    title: "Fireplace",
    emoji: "🔥",
    description: "Warm fireplace crackling for cozy evenings.",
    src: "/audio/fireplace.mp3",
    accent: "#c47a4a",
    accentSoft: "#f3d9c2",
    gradient: "linear-gradient(150deg, #b5623a 0%, #db9767 55%, #f3d9c2 100%)",
  },
  {
    id: "crickets",
    title: "Night Crickets",
    emoji: "🌙",
    description: "Relaxing nighttime ambience for sleep and winding down.",
    src: "/audio/crickets.mp3",
    accent: "#6d6bb0",
    accentSoft: "#d3d0ec",
    gradient: "linear-gradient(150deg, #4b4a80 0%, #8482c4 55%, #d3d0ec 100%)",
  },
];

/** The card surfaced under "Recommended Today". */
export const RECOMMENDED: {
  id: SoundId;
  reason: string;
} = {
  id: "rain",
  reason: "Perfect for reducing stress after a busy day.",
};
