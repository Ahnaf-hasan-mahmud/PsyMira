/* ============================================================
   Story data — "The Silent Lake".
   A short branching reflection. Each choice carries gentle
   emotion weights; we mirror patterns back, never scores.
   ============================================================ */

export type Emotion =
  | "stillness"
  | "courage"
  | "connection"
  | "curiosity"
  | "tenderness";

export type SceneKey = "lake" | "path" | "forest" | "summit" | "dawn";

export type Choice = {
  id: string;
  label: string;
  /** a short line of consequence shown as the scene transitions */
  echo: string;
  weights: Partial<Record<Emotion, number>>;
};

export type Scene = {
  id: string;
  scene: SceneKey;
  title: string;
  paragraph: string;
  question: string;
  choices: Choice[];
};

export const STORY = {
  title: "The Silent Lake",
  scenes: [
    {
      id: "s1",
      scene: "lake",
      title: "The Silent Lake",
      paragraph:
        "A traveler reaches a silent lake after walking for days. The water is perfectly still, holding the sky like a held breath. No wind, no birdsong — only quiet.",
      question: "What do you do?",
      choices: [
        {
          id: "sit",
          label: "Sit beside the water",
          echo: "You lower yourself onto the cool stone and let the stillness in.",
          weights: { stillness: 3, tenderness: 1 },
        },
        {
          id: "walk",
          label: "Keep walking",
          echo: "Something in you isn't ready to stop. You move on, lighter somehow.",
          weights: { courage: 3, curiosity: 1 },
        },
        {
          id: "call",
          label: "Call out for someone",
          echo: "Your voice crosses the water. You realize how much you've missed being heard.",
          weights: { connection: 3, tenderness: 1 },
        },
      ],
    },
    {
      id: "s2",
      scene: "forest",
      title: "A Path Through the Pines",
      paragraph:
        "Beyond the lake, a narrow path winds into a grove of tall pines. The light turns soft and green-gold. You sense the trees have stood here far longer than your worries.",
      question: "How do you move through them?",
      choices: [
        {
          id: "slow",
          label: "Slowly, noticing everything",
          echo: "You let your eyes rest on bark, moss, the slow drift of dust in light.",
          weights: { curiosity: 2, stillness: 2 },
        },
        {
          id: "rest",
          label: "Rest your hand on a tree",
          echo: "The trunk is warm. For a moment, you let it hold a little of your weight.",
          weights: { tenderness: 3 },
        },
        {
          id: "onward",
          label: "Press onward with purpose",
          echo: "You keep a steady pace. There's somewhere in you that wants to arrive.",
          weights: { courage: 2, curiosity: 1 },
        },
      ],
    },
    {
      id: "s3",
      scene: "path",
      title: "The Lantern at the Crossing",
      paragraph:
        "The path forks at a small wooden bridge. On the railing hangs an unlit lantern and a box of matches, left by someone long gone. Dusk is beginning to settle.",
      question: "Do you light it?",
      choices: [
        {
          id: "light",
          label: "Light it for whoever comes next",
          echo: "A small flame catches. You leave a little warmth behind you.",
          weights: { connection: 2, tenderness: 2 },
        },
        {
          id: "carry",
          label: "Take it to light your own way",
          echo: "You lift the lantern. The dark ahead feels a touch less wide.",
          weights: { courage: 2, curiosity: 1 },
        },
        {
          id: "leave",
          label: "Leave it, and trust the dusk",
          echo: "You let your eyes adjust. There is a quiet you only meet in the dark.",
          weights: { stillness: 3 },
        },
      ],
    },
    {
      id: "s4",
      scene: "summit",
      title: "The Open Rise",
      paragraph:
        "The trees thin and the ground lifts. You come to an open rise where the whole valley spreads below — the lake, the pines, the small bridge, all of it smaller now, and gentler.",
      question: "What rises in you, looking back?",
      choices: [
        {
          id: "pride",
          label: "A quiet pride in how far you came",
          echo: "You let yourself feel it, without needing to earn it.",
          weights: { courage: 2, tenderness: 1 },
        },
        {
          id: "gratitude",
          label: "Gratitude for the stillness you found",
          echo: "The quiet of the lake is still in you, like a smooth stone in a pocket.",
          weights: { stillness: 2, tenderness: 1 },
        },
        {
          id: "wonder",
          label: "Wonder at what lies beyond",
          echo: "Your gaze drifts past the ridge. The world feels open again.",
          weights: { curiosity: 3 },
        },
      ],
    },
    {
      id: "s5",
      scene: "dawn",
      title: "First Light",
      paragraph:
        "You rest until the sky softens to rose and grey. Morning arrives the way it always does — without being asked. You feel, for now, that you are exactly where you need to be.",
      question: "How do you greet the new day?",
      choices: [
        {
          id: "breath",
          label: "With a long, slow breath",
          echo: "You breathe the cold air all the way down, and let it go.",
          weights: { stillness: 2, tenderness: 1 },
        },
        {
          id: "step",
          label: "With a single brave step forward",
          echo: "You rise. Whatever comes next, you'll meet it as you are.",
          weights: { courage: 3 },
        },
        {
          id: "thanks",
          label: "With thanks for the journey",
          echo: "You whisper a small thank-you to no one, and to everyone.",
          weights: { connection: 2, tenderness: 1 },
        },
      ],
    },
  ] as Scene[],
};

export const EMOTION_META: Record<
  Emotion,
  { label: string; color: string; line: string }
> = {
  stillness: {
    label: "Stillness",
    color: "#a78bfa",
    line: "You're drawn to quiet and rest. You find clarity in slowing down.",
  },
  courage: {
    label: "Courage",
    color: "#8b6df0",
    line: "You meet the unknown by moving toward it. Forward motion steadies you.",
  },
  connection: {
    label: "Connection",
    color: "#c4b5fd",
    line: "You reach for others, and leave warmth behind you. Belonging matters.",
  },
  curiosity: {
    label: "Curiosity",
    color: "#d8b4fe",
    line: "You're pulled by what's beyond the next ridge. Wonder keeps you open.",
  },
  tenderness: {
    label: "Tenderness",
    color: "#ecd9c4",
    line: "You move gently — with the world, and with yourself. Softness is your strength.",
  },
};

/** Tally choices into emotion totals, sorted strongest-first. */
export function tally(
  choices: Choice[]
): { emotion: Emotion; value: number }[] {
  const totals: Record<Emotion, number> = {
    stillness: 0,
    courage: 0,
    connection: 0,
    curiosity: 0,
    tenderness: 0,
  };
  for (const c of choices) {
    for (const [e, w] of Object.entries(c.weights)) {
      totals[e as Emotion] += w ?? 0;
    }
  }
  return (Object.keys(totals) as Emotion[])
    .map((emotion) => ({ emotion, value: totals[emotion] }))
    .sort((a, b) => b.value - a.value);
}
