/* ============================================================
   PsyMira — "One Ordinary Monday"
   A branching, story-based emotional wellness assessment.
   The user lives through one day; each choice quietly shifts
   eleven hidden traits. We mirror patterns back as a warm,
   strengths-first profile — never a clinical diagnosis.
   ============================================================ */

export type Trait =
  | "DEP" // Depression
  | "ANX" // Anxiety
  | "STR" // Stress
  | "SW" // Social Withdrawal
  | "AVO" // Avoidance
  | "RUM" // Rumination
  | "RES" // Resilience
  | "OPT" // Optimism
  | "MOT" // Motivation
  | "ER" // Emotional Regulation
  | "SE"; // Self-esteem

export type DaySceneKey =
  | "morning"
  | "busstop"
  | "commute"
  | "office"
  | "lunch"
  | "desk"
  | "phone"
  | "rain"
  | "dinner"
  | "home"
  | "night";

export type AChoice = {
  id: string;
  label: string;
  /** short line shown as the scene transitions */
  echo: string;
  weights: Partial<Record<Trait, number>>;
  /** id of the next scene, or "END" to finish */
  next: string;
};

export type AScene = {
  id: string;
  scene: DaySceneKey;
  chapter: string;
  title: string;
  paragraph: string;
  question: string;
  choices: AChoice[];
};

export const NEGATIVE: Trait[] = ["DEP", "ANX", "STR", "SW", "AVO", "RUM"];
export const POSITIVE: Trait[] = ["RES", "OPT", "MOT", "ER", "SE"];

export const TRAIT_META: Record<
  Trait,
  { label: string; full: string; color: string; positive: boolean }
> = {
  DEP: { label: "Low Mood", full: "Depression", color: "#8b6df0", positive: false },
  ANX: { label: "Anxiety", full: "Anxiety", color: "#a78bfa", positive: false },
  STR: { label: "Stress", full: "Stress", color: "#b794f6", positive: false },
  SW: { label: "Withdrawal", full: "Social Withdrawal", color: "#9f7aea", positive: false },
  AVO: { label: "Avoidance", full: "Avoidance", color: "#c4b5fd", positive: false },
  RUM: { label: "Rumination", full: "Rumination", color: "#b6a3ef", positive: false },
  RES: { label: "Resilience", full: "Resilience", color: "#7c5cf0", positive: true },
  OPT: { label: "Optimism", full: "Optimism", color: "#9d7bf5", positive: true },
  MOT: { label: "Motivation", full: "Motivation", color: "#8b6df0", positive: true },
  ER: { label: "Regulation", full: "Emotional Regulation", color: "#a78bfa", positive: true },
  SE: { label: "Self-esteem", full: "Self-esteem", color: "#c4b5fd", positive: true },
};

/* ============================================================
   The story — 13 decision points, hub-and-spoke branching.
   ============================================================ */

export const ASSESSMENT = {
  id: "monday",
  title: "One Ordinary Monday",
  subtitle: "A day that quietly reveals how you're really doing",
  start: "s1",
  /** decision points on any path — used for the progress bar */
  total: 13,
  scenes: [
    {
      id: "s1",
      scene: "morning",
      chapter: "7:04 AM",
      title: "Monday Morning",
      paragraph:
        "The alarm cuts through a dream you were almost enjoying. Grey light leans on the curtains. Today matters — the presentation you've circled all week is finally here. Your body feels heavy against the sheets.",
      question: "How do you meet the morning?",
      choices: [
        { id: "a", label: "Sit up, breathe, and remind yourself you're ready", echo: "You plant your feet on the floor and take the day as it comes.", weights: { RES: 2, OPT: 1, SE: 1 }, next: "s2" },
        { id: "b", label: "Snooze once — your heart's already tight about it", echo: "Ten more minutes, and the worry fills every one of them.", weights: { ANX: 2, STR: 1 }, next: "s2" },
        { id: "c", label: "Lie still; the day feels like too much already", echo: "The ceiling looks back at you. Everything feels far away.", weights: { DEP: 3, MOT: -2 }, next: "s2" },
        { id: "d", label: "Scroll your phone to put the day off", echo: "The feed is easier than the morning. You let it swallow a while.", weights: { AVO: 2, MOT: -1 }, next: "s2" },
      ],
    },
    {
      id: "s2",
      scene: "busstop",
      chapter: "8:12 AM",
      title: "The Bus",
      paragraph:
        "You reach the stop just as your bus pulls away, brake lights glowing in the drizzle. The next one is twelve minutes out — and that eats into your prep time.",
      question: "What now?",
      choices: [
        { id: "a", label: "Sprint — you catch the driver's eye and he waits", echo: "Your lungs burn, but the doors hiss open. Made it.", weights: { RES: 2, MOT: 1, OPT: 1 }, next: "s3" },
        { id: "b", label: "Miss it; pace the stop, replaying how you're behind", echo: "Your mind runs the math of lost minutes, over and over.", weights: { ANX: 2, RUM: 1, STR: 1 }, next: "s3" },
        { id: "c", label: "Sink onto the wet bench. Of course. Typical.", echo: "One more thing that proves the kind of day it'll be.", weights: { DEP: 2, OPT: -1 }, next: "s3" },
        { id: "d", label: "Order a ride you can't really afford, to escape the feeling", echo: "The fare stings, but at least the waiting stops.", weights: { AVO: 1, STR: 1, ER: -1 }, next: "s3" },
      ],
    },
    {
      id: "s3",
      scene: "commute",
      chapter: "8:40 AM",
      title: "The Commute",
      paragraph:
        "Finally moving. The window fogs; a stranger's elbow presses into yours. Your phone buzzes — your manager: \u201cLooking forward to your slides at 10.\u201d",
      question: "How does that message land?",
      choices: [
        { id: "a", label: "A flicker of nerves, then focus — you skim your notes", echo: "You let the nerves sharpen you instead of scatter you.", weights: { ANX: 1, RES: 1, MOT: 1 }, next: "s4" },
        { id: "b", label: "Your stomach drops; you read it four times", echo: "Eight words, and your body reacts like it's a verdict.", weights: { ANX: 3, RUM: 1 }, next: "s4" },
        { id: "c", label: "Put the phone face-down and stare out the window", echo: "If you don't look at it, maybe it isn't quite real yet.", weights: { AVO: 2, SW: 1 }, next: "s4" },
        { id: "d", label: "Think: \u201cThey're already judging me.\u201d", echo: "The sentence writes itself before you can stop it.", weights: { ANX: 2, SE: -1, RUM: 1 }, next: "s4" },
      ],
    },
    {
      id: "s4",
      scene: "office",
      chapter: "10:06 AM",
      title: "The Room",
      paragraph:
        "Faces turn toward you. You're a few slides in when the screen freezes — a slide won't load — and someone raises a hand with a question you didn't prepare for. The room waits.",
      question: "What do you do?",
      choices: [
        { id: "a", label: "Smile: \u201cGreat question — let me take that while tech catches up.\u201d", echo: "You hold the room with nothing but your calm. It works.", weights: { RES: 3, ER: 2, OPT: 1, SE: 1 }, next: "s5g" },
        { id: "b", label: "Freeze — face hot, fumbling for words", echo: "The silence stretches. You can hear your own heartbeat.", weights: { ANX: 3, STR: 2, SE: -1 }, next: "s5r" },
        { id: "c", label: "Apologize over and over and rush to end early", echo: "You shrink the moment down and hurry off the stage of it.", weights: { AVO: 2, SE: -2, DEP: 1 }, next: "s5r" },
        { id: "d", label: "Snap a little at the questioner, then regret it", echo: "The words come out sharper than you meant. You feel it land.", weights: { ER: -2, STR: 1 }, next: "s5r" },
      ],
    },
    {
      id: "s5g",
      scene: "office",
      chapter: "10:32 AM",
      title: "The Verdict",
      paragraph:
        "It ends. Your manager walks over. You can't quite read their face as they cross the room toward you.",
      question: "What are you bracing for?",
      choices: [
        { id: "a", label: "Curiosity — you're genuinely open to what they'll say", echo: "Whatever it is, you can use it. You meet their eyes.", weights: { RES: 1, OPT: 1, SE: 1 }, next: "s6a" },
        { id: "b", label: "The worst — you're already rehearsing your defense", echo: "Your mind builds the courtroom before they say a word.", weights: { ANX: 2, RUM: 1 }, next: "s6a" },
        { id: "c", label: "Numb resignation; it won't be good anyway", echo: "You brace for a blow you're sure is coming.", weights: { DEP: 2, OPT: -1 }, next: "s6a" },
      ],
    },
    {
      id: "s5r",
      scene: "office",
      chapter: "10:32 AM",
      title: "The Verdict",
      paragraph:
        "It ends, finally. Your manager walks over. You can't quite read their face as they cross the room toward you.",
      question: "What are you bracing for?",
      choices: [
        { id: "a", label: "Curiosity — you're genuinely open to what they'll say", echo: "Whatever it is, you can use it. You meet their eyes.", weights: { RES: 1, OPT: 1, SE: 1 }, next: "s6b" },
        { id: "b", label: "The worst — you're already rehearsing your defense", echo: "Your mind builds the courtroom before they say a word.", weights: { ANX: 2, RUM: 1 }, next: "s6b" },
        { id: "c", label: "Numb resignation; it won't be good anyway", echo: "You brace for a blow you're sure is coming.", weights: { DEP: 2, OPT: -1 }, next: "s6b" },
      ],
    },
    {
      id: "s6a",
      scene: "office",
      chapter: "10:34 AM",
      title: "Praise",
      paragraph:
        "\u201cThat recovery was impressive,\u201d they say. \u201cYou kept the room. Well done.\u201d A few colleagues nod. Warmth spreads — unfamiliar, a little uncomfortable.",
      question: "How do you take it in?",
      choices: [
        { id: "a", label: "\u201cThank you — I worked hard on that.\u201d You let it land", echo: "For once, you let the good thing simply be true.", weights: { SE: 3, OPT: 2, RES: 1 }, next: "s7" },
        { id: "b", label: "\u201cIt was mostly luck, honestly.\u201d", echo: "You hand the compliment back before it can settle.", weights: { SE: -2, RUM: 1 }, next: "s7" },
        { id: "c", label: "Wait for the \u201cbut\u201d that never comes", echo: "You keep listening for the catch. There isn't one.", weights: { ANX: 2, RUM: 1 }, next: "s7" },
      ],
    },
    {
      id: "s6b",
      scene: "office",
      chapter: "10:34 AM",
      title: "Criticism",
      paragraph:
        "\u201cIt got shaky in the middle,\u201d they say, not unkindly. \u201cTighten it up next time.\u201d Then they walk off. The words settle somewhere behind your ribs.",
      question: "What do you do with that?",
      choices: [
        { id: "a", label: "Note it as useful — one rough patch isn't the whole story", echo: "You take the feedback and leave the sting behind.", weights: { RES: 2, ER: 2, SE: 1 }, next: "s7" },
        { id: "b", label: "Replay the shaky middle on a loop for the next hour", echo: "The same ten seconds, again and again, all afternoon.", weights: { RUM: 3, ANX: 1, DEP: 1 }, next: "s7" },
        { id: "c", label: "Decide you're just bad at this, and always will be", echo: "One comment becomes a verdict on all of you.", weights: { DEP: 3, SE: -2, MOT: -1 }, next: "s7" },
        { id: "d", label: "Shrug it off; refuse to think about it at all", echo: "You slam a door on the whole thing and walk away.", weights: { AVO: 2, ER: -1 }, next: "s7" },
      ],
    },
    {
      id: "s7",
      scene: "lunch",
      chapter: "12:15 PM",
      title: "Lunch",
      paragraph:
        "A small group gathers by the door: \u201cWe're grabbing lunch — come with?\u201d Your sandwich is in your bag. Your energy is somewhere in the negatives.",
      question: "What do you choose?",
      choices: [
        { id: "a", label: "Go with them — you could use the company", echo: "You leave your desk behind and let the noise carry you.", weights: { SW: -2, OPT: 1, RES: 1 }, next: "s8a" },
        { id: "b", label: "\u201cNext time\u201d — and eat alone at your desk", echo: "You wave them off and the office goes quiet around you.", weights: { SW: 2, AVO: 1 }, next: "s8b" },
        { id: "c", label: "Almost say yes, then invent an excuse", echo: "The yes was right there. Something pulls it back.", weights: { ANX: 1, AVO: 2, SW: 1 }, next: "s8b" },
        { id: "d", label: "Go, but stay quiet and on your phone the whole time", echo: "You're at the table, and somehow still not there.", weights: { SW: 1, DEP: 1 }, next: "s8a" },
      ],
    },
    {
      id: "s8a",
      scene: "lunch",
      chapter: "12:40 PM",
      title: "The Table",
      paragraph:
        "Warm noise, shared fries. Midway through, a friend goes quiet and admits they've been struggling lately.",
      question: "How do you respond?",
      choices: [
        { id: "a", label: "Lean in, listen, and tell them you're glad they said it", echo: "You give them the thing you'd want — to be heard.", weights: { ER: 2, RES: 1, SW: -1 }, next: "s9" },
        { id: "b", label: "Try to \u201cfix\u201d it fast so the discomfort passes", echo: "You reach for solutions before they've finished the sentence.", weights: { ANX: 1, ER: -1 }, next: "s9" },
        { id: "c", label: "Go quiet; their pain pulls up too much of your own", echo: "Their words find a door in you that you keep shut.", weights: { DEP: 1, RUM: 1 }, next: "s9" },
        { id: "d", label: "Change the subject to something lighter", echo: "You steer everyone back to safer, shallower water.", weights: { AVO: 2 }, next: "s9" },
      ],
    },
    {
      id: "s8b",
      scene: "desk",
      chapter: "12:40 PM",
      title: "Alone at the Desk",
      paragraph:
        "Quiet sandwich, blue light. You open your phone and the feed is all everyone else's highlight reels — trips, wins, easy smiles.",
      question: "Where does your mind go?",
      choices: [
        { id: "a", label: "Set the phone down and take a real breath", echo: "You catch the spiral early and step off it.", weights: { ER: 2, RES: 1 }, next: "s9" },
        { id: "b", label: "Compare, and come up short every time", echo: "Everyone else seems to have the manual you were never handed.", weights: { DEP: 2, SE: -2, RUM: 1 }, next: "s9" },
        { id: "c", label: "Message no one, though you want to", echo: "Your thumb hovers over a name, then closes the app.", weights: { SW: 2, DEP: 1 }, next: "s9" },
        { id: "d", label: "Keep scrolling to feel a little less", echo: "Forty minutes vanish and you don't feel any better.", weights: { AVO: 2, MOT: -1 }, next: "s9" },
      ],
    },
    {
      id: "s9",
      scene: "desk",
      chapter: "2:03 PM",
      title: "The Mistake",
      paragraph:
        "Your stomach lurches: the report you sent this morning went to the wrong client. It's a real mistake, and people will notice.",
      question: "First reaction?",
      choices: [
        { id: "a", label: "Owl-calm: flag it, own it, and start fixing", echo: "You name it out loud and get moving on the repair.", weights: { RES: 3, ER: 2, SE: 1 }, next: "s10" },
        { id: "b", label: "Panic floods; your hands shake as you type", echo: "Your whole body sounds the alarm at once.", weights: { ANX: 3, STR: 2 }, next: "s10" },
        { id: "c", label: "\u201cI ruin everything.\u201d The mistake becomes about you", echo: "One error blooms into a story about who you are.", weights: { DEP: 2, SE: -2, RUM: 1 }, next: "s10" },
        { id: "d", label: "Hope no one noticed; say nothing yet", echo: "You sit very still and wait for it to maybe disappear.", weights: { AVO: 3, STR: 1 }, next: "s10" },
      ],
    },
    {
      id: "s10",
      scene: "phone",
      chapter: "5:20 PM",
      title: "The Call",
      paragraph:
        "Your phone lights up: Mom. She calls most Mondays. You're drained, and you know she'll ask how the presentation went.",
      question: "Do you pick up?",
      choices: [
        { id: "a", label: "Answer warmly — her voice actually helps", echo: "\u201cHi Mom.\u201d And something in your chest loosens a notch.", weights: { SW: -2, OPT: 1, ER: 1 }, next: "s11" },
        { id: "b", label: "Answer, but keep it clipped and rushed", echo: "You give her the headlines and an excuse to go.", weights: { SW: 1, STR: 1 }, next: "s11" },
        { id: "c", label: "Let it ring — you'll \u201ccall back later\u201d", echo: "The buzzing stops. Later has a way of not arriving.", weights: { SW: 2, AVO: 1 }, next: "s11" },
        { id: "d", label: "Silence it — a flash of guilt, then nothing", echo: "You press the button and the guilt fades to grey.", weights: { DEP: 1, SW: 2, ER: -1 }, next: "s11" },
      ],
    },
    {
      id: "s11",
      scene: "rain",
      chapter: "6:00 PM",
      title: "Rain, and an Open Evening",
      paragraph:
        "You step outside into pouring rain — no umbrella, of course. As the bus nears, a text from your sister: \u201cFamily dinner tonight? Mom's cooking.\u201d Warm lamplight, or your own quiet apartment.",
      question: "How does the evening go?",
      choices: [
        { id: "a", label: "Tip your face to the rain, then say yes to dinner", echo: "The rain is almost funny. You text back: on my way.", weights: { OPT: 2, SW: -2, RES: 1 }, next: "s12a" },
        { id: "b", label: "Grumble at the rain; go, but you're not up for people", echo: "You go, dripping and reluctant, for their sake more than yours.", weights: { STR: 1, SW: 1 }, next: "s12a" },
        { id: "c", label: "Skip dinner; you don't have the face for anyone tonight", echo: "You text a soft no and turn toward the empty apartment.", weights: { SW: 2, AVO: 1, DEP: 1 }, next: "s12b" },
        { id: "d", label: "Want to go, but the effort feels impossible", echo: "You can picture it, but your body just won't carry you there.", weights: { DEP: 2, MOT: -2 }, next: "s12b" },
      ],
    },
    {
      id: "s12a",
      scene: "dinner",
      chapter: "7:30 PM",
      title: "At the Table",
      paragraph:
        "The kitchen is loud and bright. Mid-meal, a relative asks, a little too casually, \u201cSo when are you finally getting promoted?\u201d",
      question: "How do you handle it?",
      choices: [
        { id: "a", label: "Laugh it off, set a gentle boundary, stay warm", echo: "\u201cWorking on it — pass the rice?\u201d And the moment softens.", weights: { ER: 2, SE: 1, RES: 1 }, next: "s13" },
        { id: "b", label: "Smile tightly while it gnaws at you for an hour", echo: "You keep eating, but the question keeps chewing on you.", weights: { RUM: 2, ANX: 1, SE: -1 }, next: "s13" },
        { id: "c", label: "Feel small and say nothing", echo: "You shrink an inch in your chair and let it pass.", weights: { DEP: 1, SE: -2, SW: 1 }, next: "s13" },
        { id: "d", label: "Get sharp, then feel bad about the quiet that follows", echo: "The table goes still, and you wish you'd said it kinder.", weights: { ER: -2, STR: 1 }, next: "s13" },
      ],
    },
    {
      id: "s12b",
      scene: "home",
      chapter: "7:30 PM",
      title: "The Empty Apartment",
      paragraph:
        "You let yourself in. The silence is total. Your reflection moves across the dark window as you drop your bag. The evening is yours — a few open hours before bed.",
      question: "How do you spend the quiet?",
      choices: [
        { id: "a", label: "Something nourishing — cook, read, stretch, call a friend", echo: "You choose one small kind thing, and actually do it.", weights: { MOT: 2, RES: 2, OPT: 1 }, next: "s13" },
        { id: "b", label: "Collapse and scroll until the hours blur", echo: "The couch swallows you and the evening dissolves.", weights: { AVO: 2, MOT: -2, DEP: 1 }, next: "s13" },
        { id: "c", label: "Open the laptop and work more; you don't deserve rest", echo: "Rest feels unearned, so you keep grinding instead.", weights: { STR: 2, SE: -1 }, next: "s13" },
        { id: "d", label: "Sit in the dark, not really doing anything", echo: "You mean to get up. The dark just keeps sitting with you.", weights: { DEP: 3, MOT: -2, SW: 1 }, next: "s13" },
      ],
    },
    {
      id: "s13",
      scene: "night",
      chapter: "11:47 PM",
      title: "Late Night",
      paragraph:
        "Lights off. The ceiling above you. This is the hour your mind likes to talk — and today gave it material. Soon, sleep will come.",
      question: "What does the dark bring, and how do you drift off?",
      choices: [
        { id: "a", label: "A fair review — some rough patches, some real wins — then a long, calm exhale", echo: "You set the day down gently, and let sleep take you.", weights: { RES: 2, ER: 2, OPT: 1, STR: -1 }, next: "END" },
        { id: "b", label: "A courtroom where you're always the defendant; sleep is slow", echo: "Your mind keeps its case open long past midnight.", weights: { RUM: 3, ANX: 2, SE: -1 }, next: "END" },
        { id: "c", label: "A slow tide of \u201cwhat's the point,\u201d then you sink like a stone", echo: "You go under fast, into a heavy, dreamless dark.", weights: { DEP: 3, OPT: -2, MOT: -1 }, next: "END" },
        { id: "d", label: "You reach for your phone to drown it out until you pass out", echo: "The glow keeps the thoughts at bay, one more scroll at a time.", weights: { AVO: 2, ANX: 1 }, next: "END" },
      ],
    },
  ] as AScene[],
};

/* ============================================================
   Scoring engine
   ============================================================ */

export type Totals = Record<Trait, number>;

export function accumulate(picks: AChoice[]): Totals {
  const t: Totals = {
    DEP: 0, ANX: 0, STR: 0, SW: 0, AVO: 0, RUM: 0,
    RES: 0, OPT: 0, MOT: 0, ER: 0, SE: 0,
  };
  for (const c of picks) {
    for (const [k, v] of Object.entries(c.weights)) {
      t[k as Trait] += v ?? 0;
    }
  }
  return t;
}

export type CatTone = "flourishing" | "mild" | "moderate" | "high" | "veryhigh";

export function categorize(trait: Trait, value: number): { label: string; tone: CatTone } {
  const positive = TRAIT_META[trait].positive;
  if (positive) {
    if (value >= 10) return { label: "Flourishing", tone: "flourishing" };
    if (value >= 7) return { label: "Strong", tone: "mild" };
    if (value >= 4) return { label: "Developing", tone: "moderate" };
    if (value >= 1) return { label: "Fragile", tone: "high" };
    return { label: "Depleted", tone: "veryhigh" };
  }
  if (value <= 3) return { label: "Flourishing", tone: "flourishing" };
  if (value <= 6) return { label: "Mild Concern", tone: "mild" };
  if (value <= 9) return { label: "Moderate Concern", tone: "moderate" };
  if (value <= 12) return { label: "High Concern", tone: "high" };
  return { label: "Very High Concern", tone: "veryhigh" };
}

const MAXT = 12;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export function wellness(t: Totals): { score: number; band: string } {
  const posIndex =
    POSITIVE.reduce((s, k) => s + clamp01(t[k] / MAXT), 0) / POSITIVE.length;
  const negIndex =
    NEGATIVE.reduce((s, k) => s + clamp01(t[k] / MAXT), 0) / NEGATIVE.length;
  const score = Math.round(100 * (0.5 * posIndex + 0.5 * (1 - negIndex)));
  const band =
    score >= 80 ? "Thriving"
    : score >= 65 ? "Steady"
    : score >= 50 ? "Managing"
    : score >= 35 ? "Strained"
    : "Struggling";
  return { score, band };
}

/** Normalise a trait to 0–10 for the radar chart. */
export function radarData(t: Totals) {
  return (Object.keys(TRAIT_META) as Trait[]).map((k) => ({
    trait: TRAIT_META[k].label,
    value: Math.max(0, Math.min(10, t[k])),
    positive: TRAIT_META[k].positive,
  }));
}

const POS_ADJ: Record<Trait, string> = {
  RES: "Resilient", OPT: "Hopeful", MOT: "Driven", ER: "Steady", SE: "Confident",
  DEP: "", ANX: "", STR: "", SW: "", AVO: "", RUM: "",
};
const NEG_NOUN: Record<Trait, string> = {
  ANX: "Worrier", RUM: "Overthinker", DEP: "Dreamer", STR: "Achiever",
  SW: "Solitary", AVO: "Wanderer",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

function topTrait(t: Totals, pool: Trait[], preferHigh = true): Trait {
  return [...pool].sort((a, b) => (preferHigh ? t[b] - t[a] : t[a] - t[b]))[0];
}

export function profile(t: Totals): { name: string; blurb: string } {
  const pos = topTrait(t, POSITIVE);
  const neg = topTrait(t, NEGATIVE);
  const name = `The ${POS_ADJ[pos]} ${NEG_NOUN[neg]}`;
  const blurb = `You lead with ${TRAIT_META[pos].full.toLowerCase()} — it's the quiet engine underneath your day. At the same time, ${TRAIT_META[neg].full.toLowerCase()} tends to show up when things get hard. Knowing both is how you start to work with yourself, not against yourself.`;
  return { name, blurb };
}

const STRENGTH_LINE: Record<Trait, string> = {
  RES: "You bounce back. Setbacks bend you, but they don't keep you down.",
  OPT: "You expect light ahead — and that hope pulls you forward on hard days.",
  MOT: "You keep moving toward what matters, even when it would be easier to stop.",
  ER: "You feel things fully and still stay steady. That balance is rare.",
  SE: "You can hold a good word about yourself without flinching. That's real ground to stand on.",
  DEP: "", ANX: "", STR: "", SW: "", AVO: "", RUM: "",
};

const AREA_LINE: Record<Trait, string> = {
  DEP: "The day sometimes feels heavier than it should. Small acts of care matter more than they seem.",
  ANX: "Your mind scans for threat and braces early. Slowing the breath tells your body it's safe.",
  STR: "You're carrying a lot at once. Some of that weight can be set down without letting anything fall.",
  SW: "You pull inward when you're low — exactly when connection would help most.",
  AVO: "Hard things get pushed to later. Starting for just five minutes usually breaks the spell.",
  RUM: "Your mind replays the rough moments on a loop. It needs a gentle off-ramp, not more laps.",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

const REC_LINE: Record<Trait, string> = {
  ANX: "Try 4-7-8 breathing the moment anxiety spikes — it's on your Breathing page.",
  STR: "Use box breathing before high-pressure moments to steady your system.",
  RUM: "Set a 10-minute \u201cworry window,\u201d then deliberately shift to one present-moment task.",
  DEP: "Pick one small, nourishing action a day — behavioral activation lifts mood over time.",
  SW: "Reach for one low-stakes connection daily: a text, a wave, a two-minute call.",
  AVO: "Use the \u201cfive-minute start\u201d rule on anything you're avoiding — momentum does the rest.",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

const HABIT_LINE: Record<Trait, string> = {
  ANX: "One round of 4-7-8 breathing before your first meeting.",
  STR: "A two-minute breathing break when your shoulders creep up.",
  RUM: "Write down the looping thought once, then close the notebook.",
  DEP: "One tiny win a day — make the bed, step outside, text a friend.",
  SW: "Reply to one person you've been meaning to answer.",
  AVO: "Start the dreaded task for five minutes only.",
  RES: "Name one thing that went right today.",
  OPT: "Notice one small good thing on your commute.",
  MOT: "Choose one meaningful task and do it first.",
  ER: "Label the feeling out loud before reacting.",
  SE: "Accept one compliment today without deflecting.",
};

export type Report = {
  totals: Totals;
  wellness: { score: number; band: string };
  profile: { name: string; blurb: string };
  strengths: { trait: Trait; line: string }[];
  areas: { trait: Trait; line: string; rec: string }[];
  habits: string[];
  summary: string;
};

export function buildReport(picks: AChoice[]): Report {
  const totals = accumulate(picks);
  const w = wellness(totals);
  const prof = profile(totals);

  const strengths = [...POSITIVE]
    .sort((a, b) => totals[b] - totals[a])
    .slice(0, 3)
    .map((trait) => ({ trait, line: STRENGTH_LINE[trait] }));

  const topNeg = [...NEGATIVE].sort((a, b) => totals[b] - totals[a]).slice(0, 3);
  const areas = topNeg.map((trait) => ({
    trait,
    line: AREA_LINE[trait],
    rec: REC_LINE[trait],
  }));

  const habits = Array.from(
    new Set([
      ...topNeg.map((t) => HABIT_LINE[t]),
      HABIT_LINE[strengths[0].trait],
    ])
  ).slice(0, 4);

  const leadStrength = TRAIT_META[strengths[0].trait].full.toLowerCase();
  const leadArea = TRAIT_META[topNeg[0]].full.toLowerCase();
  const summary = `Today showed a real thread of ${leadStrength} running through you — hold onto that; it's carrying more than you realize. ${leadArea.charAt(0).toUpperCase() + leadArea.slice(1)} asked for some of your attention too, and that's okay — it's information, not a verdict. Start small, be kind to yourself, and let one gentle habit lead the way.`;

  return { totals, wellness: w, profile: prof, strengths, areas, habits, summary };
}
