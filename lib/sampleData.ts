/* ============================================================
   Sample data for charts & dashboard.
   Centralised so the landing preview and the real dashboard
   share one coherent, calm dataset.
   ============================================================ */

export const moodTrend = [
  { day: "Mon", mood: 58, calm: 62 },
  { day: "Tue", mood: 64, calm: 60 },
  { day: "Wed", mood: 55, calm: 66 },
  { day: "Thu", mood: 72, calm: 70 },
  { day: "Fri", mood: 68, calm: 74 },
  { day: "Sat", mood: 80, calm: 78 },
  { day: "Sun", mood: 76, calm: 82 },
];

export const weeklyActivity = [
  { day: "Mon", minutes: 12 },
  { day: "Tue", minutes: 20 },
  { day: "Wed", minutes: 8 },
  { day: "Thu", minutes: 24 },
  { day: "Fri", minutes: 16 },
  { day: "Sat", minutes: 30 },
  { day: "Sun", minutes: 22 },
];

export const reflectionMix = [
  { name: "Reflective", value: 38, color: "#a78bfa" },
  { name: "Hopeful", value: 27, color: "#c4b5fd" },
  { name: "Restless", value: 18, color: "#ecd9c4" },
  { name: "Calm", value: 17, color: "#ddd6fe" },
];

/** consistency as a 0–100 completion of this week's gentle rhythm */
export const consistency = 78;

/**
 * Calendar heatmap — last ~17 weeks of reflection intensity (0–4).
 * 0 = no entry, 4 = a deep reflective day.
 */
export const heatmap: number[][] = Array.from({ length: 17 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    // a soft pseudo-random pattern, denser in recent weeks
    const seed = (w * 7 + d) * 9301 + 49297;
    const r = ((seed % 233280) / 233280 + w / 40) % 1;
    if (r < 0.34) return 0;
    if (r < 0.55) return 1;
    if (r < 0.74) return 2;
    if (r < 0.9) return 3;
    return 4;
  })
);

export const recentStories = [
  {
    id: "silent-lake",
    title: "The Silent Lake",
    subtitle: "On stillness & rest",
    progress: 100,
    tint: "#a78bfa",
    status: "done" as const,
  },
  {
    id: "lantern-path",
    title: "The Lantern Path",
    subtitle: "On uncertainty",
    progress: 60,
    tint: "#c4b5fd",
    status: "reading" as const,
  },
  {
    id: "morning-tide",
    title: "Morning Tide",
    subtitle: "On new beginnings",
    progress: 0,
    tint: "#ecd9c4",
    status: "new" as const,
  },
];

export const achievements = [
  { label: "First Reflection", unlocked: true },
  { label: "7-Day Calm", unlocked: true },
  { label: "Deep Diver", unlocked: true },
  { label: "Moonlit Mind", unlocked: false },
];
