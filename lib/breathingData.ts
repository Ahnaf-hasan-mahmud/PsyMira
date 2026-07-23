/* ============================================================
   PsyMira — Breathing exercise library
   Guided patterns tuned to calm the nervous system, ease sudden
   panic, and release stress. Each phase drives the animated orb:
   `scale` sets how far the orb expands/contracts, `seconds` sets
   how long that breath phase lasts.
   ============================================================ */

export type PhaseKind = "inhale" | "hold" | "exhale";

export type Phase = {
  kind: PhaseKind;
  /** short verb shown in the orb, e.g. "Breathe in" */
  label: string;
  seconds: number;
  /** orb target scale for this phase (1 = resting) */
  scale: number;
};

export type Technique = {
  id: "box" | "478" | "deep";
  name: string;
  tag: string;
  /** one-line promise of the benefit */
  purpose: string;
  /** compact rhythm caption, e.g. "4 · 4 · 4 · 4" */
  rhythm: string;
  /** accent used for the orb + selected chip */
  color: string;
  colorSoft: string;
  phases: Phase[];

  /* ---- detailed guide (shown on the dedicated page) ---- */
  /** a paragraph explaining what the technique is */
  about: string;
  /** what happens in the body — the "why it works" */
  howItWorks: string;
  /** the cycle broken into plain steps */
  steps: string[];
  /** concrete benefits */
  benefits: string[];
  /** who this is best for / when to reach for it */
  bestFor: string[];
  /** gentle guidance on what to watch for */
  note: string;
  /** rough time for one round */
  roundLength: string;
  /** short 3-4 line description shown on the cards */
  short: string;
  /** one-line "best when" cue */
  whenShort: string;
};

export const TECHNIQUES: Technique[] = [
  {
    id: "box",
    name: "Box Breathing",
    tag: "Steady the storm",
    purpose:
      "Equal counts reset a racing heart — the pattern Navy SEALs use to stay calm under pressure.",
    rhythm: "4 · 4 · 4 · 4",
    color: "#a78bfa",
    colorSoft: "#ddd6fe",
    phases: [
      { kind: "inhale", label: "Breathe in", seconds: 4, scale: 1.32 },
      { kind: "hold", label: "Hold", seconds: 4, scale: 1.32 },
      { kind: "exhale", label: "Breathe out", seconds: 4, scale: 1.0 },
      { kind: "hold", label: "Hold", seconds: 4, scale: 1.0 },
    ],
    about:
      "Box breathing (also called square breathing) uses four equal parts — inhale, hold, exhale, hold — each for the same count. The even, predictable rhythm gives a busy mind something steady to hold onto.",
    howItWorks:
      "Slowing your breath to a fixed, balanced pace signals the vagus nerve to shift you out of “fight or flight” and into the parasympathetic “rest and digest” state. Heart rate settles, blood pressure eases, and racing thoughts lose their momentum.",
    steps: [
      "Breathe in slowly through your nose for 4 seconds.",
      "Hold the breath gently for 4 seconds.",
      "Breathe out through your mouth for 4 seconds.",
      "Hold empty for 4 seconds, then repeat.",
    ],
    benefits: [
      "Calms a racing heart within a few rounds",
      "Sharpens focus and steadies decision-making",
      "Easy to remember under pressure",
    ],
    bestFor: [
      "Feeling overwhelmed or scattered",
      "Before a stressful task, exam, or meeting",
      "Anyone new to breathing exercises",
    ],
    note: "If holding the breath feels uncomfortable, shorten the count to 3. Never strain — it should feel calming, not forced.",
    roundLength: "~16 seconds per round",
    short:
      "Breathe in, hold, out, and hold — all for an equal 4 counts. The steady, even rhythm quiets a busy mind and slows a racing heart. Simple to remember, so it's the easiest one to start with.",
    whenShort: "You feel scattered, tense, or need to focus.",
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    tag: "Ease a panic wave",
    purpose:
      "A long, slow exhale switches on your body's rest response — ideal the moment anxiety spikes.",
    rhythm: "4 · 7 · 8",
    color: "#8b6df0",
    colorSoft: "#c4b5fd",
    phases: [
      { kind: "inhale", label: "Breathe in", seconds: 4, scale: 1.34 },
      { kind: "hold", label: "Hold", seconds: 7, scale: 1.34 },
      { kind: "exhale", label: "Breathe out", seconds: 8, scale: 1.0 },
    ],
    about:
      "The 4-7-8 method, popularised by Dr. Andrew Weil, is built around one long exhale: breathe in for 4, hold for 7, and release slowly for 8. The extended out-breath is the active ingredient.",
    howItWorks:
      "A long exhale is the fastest natural brake on the nervous system. Emptying the lungs slowly stimulates the vagus nerve and drops your heart rate quickly, which is why this pattern can take the edge off a panic surge in just a few cycles — and why many people use it to fall asleep.",
    steps: [
      "Breathe in quietly through your nose for 4 seconds.",
      "Hold your breath for 7 seconds.",
      "Exhale fully through your mouth for 8 seconds, lips pursed.",
      "Repeat for up to 4 rounds.",
    ],
    benefits: [
      "Fast relief when panic or anxiety spikes",
      "Helps quiet the mind before sleep",
      "Lowers heart rate more sharply than even breathing",
    ],
    bestFor: [
      "A sudden panic attack or anxiety surge",
      "Trouble falling asleep from a racing mind",
      "Moments you need to calm down quickly",
    ],
    note: "The long hold can feel intense at first — start with 1–2 rounds and build up. Do it seated, not standing, in case you feel light-headed.",
    roundLength: "~19 seconds per round",
    short:
      "Breathe in for 4, hold for 7, and let a long, slow breath out for 8. That extended exhale calms you fast, so it's the go-to when anxiety spikes or you can't switch your mind off at night.",
    whenShort: "Panic is rising or you can't fall asleep.",
  },
  {
    id: "deep",
    name: "Deep Breathing",
    tag: "Release the tension",
    purpose:
      "Slow belly breaths melt built-up stress and bring you gently back to the present.",
    rhythm: "5 · 2 · 6",
    color: "#c4b5fd",
    colorSoft: "#ecd9c4",
    phases: [
      { kind: "inhale", label: "Breathe in", seconds: 5, scale: 1.36 },
      { kind: "hold", label: "Hold", seconds: 2, scale: 1.36 },
      { kind: "exhale", label: "Breathe out", seconds: 6, scale: 1.0 },
    ],
    about:
      "Deep (diaphragmatic or “belly”) breathing means drawing air all the way down so your belly rises more than your chest. A gentle 5-2-6 rhythm makes each breath full, slow, and grounding.",
    howItWorks:
      "Most of us breathe shallowly into the chest when stressed. Breathing deep into the diaphragm increases oxygen exchange and engages the vagus nerve, releasing the muscle tension and tightness that stress leaves behind. It's the foundation every other technique builds on.",
    steps: [
      "Rest one hand on your belly.",
      "Breathe in through your nose for 5 seconds, feeling your belly rise.",
      "Pause gently for 2 seconds.",
      "Breathe out slowly for 6 seconds, letting your belly fall. Repeat.",
    ],
    benefits: [
      "Releases physical tension and tight shoulders",
      "Gentle and sustainable for longer sessions",
      "Grounds you in the present moment",
    ],
    bestFor: [
      "Ongoing, low-grade stress or tightness",
      "Winding down at the end of the day",
      "A calm daily practice, not just emergencies",
    ],
    note: "Keep it soft and natural — deep does not mean big or forced. If your chest rises more than your belly, slow down.",
    roundLength: "~13 seconds per round",
    short:
      "Slow belly breaths — in for 5, a soft pause, out for 6 — drawn all the way down into your stomach. Gentle and easy to keep going, it loosens built-up tension and grounds you in the moment.",
    whenShort: "Everyday stress, tight shoulders, or winding down.",
  },
];
