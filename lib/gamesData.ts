/* ============================================================
   PsyMira — Stress Relief Games metadata.
   Four gentle, pressure-free interactive experiences.
   No failure · No competition · No timers.
   ============================================================ */

export type GameId = "bubbles" | "sand" | "ripples" | "coloring";

export type Game = {
  id: GameId;
  title: string;
  emoji: string;
  description: string;
  href: string;
  /** accent used for the card gradient + controls */
  accent: string;
  accentSoft: string;
  /** two-stop gradient for the card thumbnail */
  gradient: string;
  /** ambient sound to play while the game is active (matches relaxation sound IDs) */
  ambientSound?: string;
};

export const GAMES: Game[] = [
  {
    id: "bubbles",
    title: "Bubble Pop",
    emoji: "🫧",
    description:
      "Tap floating bubbles and watch them burst into soft light. Breathe and pop at your own pace.",
    href: "/games/bubbles",
    accent: "#7ca5d4",
    accentSoft: "#cddcee",
    gradient: "linear-gradient(150deg, #6b93c7 0%, #9bb8dc 55%, #cddcee 100%)",
    ambientSound: "/audio/ocean.mp3",
  },
  {
    id: "sand",
    title: "Sand Simulator",
    emoji: "🏖️",
    description:
      "Drop grains of sand and watch them cascade into tiny dunes. Pick a warm color and let gravity do its thing.",
    href: "/games/sand",
    accent: "#c4985a",
    accentSoft: "#f0dfc4",
    gradient: "linear-gradient(150deg, #b8884a 0%, #dbb87a 55%, #f0dfc4 100%)",
    ambientSound: "/audio/ocean.mp3",
  },
  {
    id: "ripples",
    title: "Water Ripples",
    emoji: "💧",
    description:
      "Tap the surface and watch gentle ripples spread outward. Each touch creates a new ring of calm.",
    href: "/games/ripples",
    accent: "#5a9daa",
    accentSoft: "#c0e1e7",
    gradient: "linear-gradient(150deg, #4a8f9e 0%, #7bbdc8 55%, #c0e1e7 100%)",
    ambientSound: "/audio/rain.mp3",
  },
  {
    id: "coloring",
    title: "Coloring Pages",
    emoji: "🎨",
    description:
      "Fill in calming outlines with soft colors. A flower, a butterfly, a mandala — there's no wrong way to color.",
    href: "/games/coloring",
    accent: "#a07cc4",
    accentSoft: "#dccdef",
    gradient: "linear-gradient(150deg, #8f6ab8 0%, #b99dd6 55%, #dccdef 100%)",
    ambientSound: "/audio/forest.mp3",
  },
];

/** XP awarded per game session (after ~2 min of play) */
export const GAME_XP = 15;
