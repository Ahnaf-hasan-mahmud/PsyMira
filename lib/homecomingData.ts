/* ============================================================
   PsyMira — "The Long Way Home"
   A branching, story-based emotional wellness assessment.
   Focuses on homecoming, identity, belonging, and self-worth.
   ============================================================ */

import {
  Trait,
  AChoice,
  Totals,
  accumulate,
  wellness,
  POSITIVE,
  NEGATIVE,
  TRAIT_META,
  Report,
} from "./assessmentData";

export type HomecomingSceneKey =
  | "airport"
  | "taxi"
  | "street"
  | "door"
  | "bedroom"
  | "kitchen"
  | "phone"
  | "window"
  | "mirror"
  | "cafe"
  | "night";

export type HomecomingScene = {
  id: string;
  scene: HomecomingSceneKey;
  chapter: string;
  title: string;
  paragraph: string;
  question: string;
  choices: AChoice[];
};

export const HOMECOMING_ASSESSMENT = {
  id: "homecoming",
  title: "The Long Way Home",
  subtitle: "A story about returning, settling in, and finding yourself again",
  start: "s1",
  total: 14,
  scenes: [
    {
      id: "s1",
      scene: "airport",
      chapter: "Landing",
      title: "The Arrivals Hall",
      paragraph:
        "The sliding doors open and you step through with your bag. The hall is loud — families reuniting, drivers with signs, a child running into someone's arms. You've been away for a while. Nobody is here to meet you. That was your choice.",
      question: "How does it feel to walk through alone?",
      choices: [
        { id: "a", label: "Fine — you've always been better at solitude", echo: "You move through the crowd like water. Easy.", weights: { SW: 1, AVO: 1 }, next: "s2" },
        { id: "b", label: "A small pang, then you shake it off", echo: "There's a sting, then a quiet breath, then forward.", weights: { ER: 1, RES: 1 }, next: "s2" },
        { id: "c", label: "Heavier than you expected", echo: "You watch the reunions too long. Something registers.", weights: { DEP: 2, RUM: 1 }, next: "s2" },
        { id: "d", label: "A flicker of relief — no one to perform for", echo: "Alone can feel like freedom. Today it does.", weights: { OPT: 1, SE: 1 }, next: "s2" },
      ],
    },
    {
      id: "s2",
      scene: "taxi",
      chapter: "On the way back",
      title: "The Long Ride",
      paragraph:
        "The cab smells like pine air freshener. The driver doesn't speak. You watch the city return through the window — same buildings, same streets, but you feel like someone who left a different person behind.",
      question: "What do you think about on the way home?",
      choices: [
        { id: "a", label: "What needs doing first — you make a mental list", echo: "Your mind goes straight to logistics. Comfortable.", weights: { MOT: 2, RES: 1 }, next: "s3" },
        { id: "b", label: "The trip itself — what went well, what didn't", echo: "You debrief yourself quietly, like a fair witness.", weights: { ER: 1, OPT: 1 }, next: "s3" },
        { id: "c", label: "Nothing — you zone out, watching lights blur", echo: "The city slides by. Easier not to think.", weights: { DEP: 1, AVO: 1 }, next: "s3" },
        { id: "d", label: "Whether anyone noticed you were gone", echo: "The question surfaces before you can stop it.", weights: { ANX: 2, SE: -1, RUM: 1 }, next: "s3" },
      ],
    },
    {
      id: "s3",
      scene: "street",
      chapter: "Almost there",
      title: "Familiar Ground",
      paragraph:
        "You turn onto your street. The neighbour's cat is on the wall. The bakery that was always closed on Sundays has a new sign. Small things have shifted in your absence. The world kept going.",
      question: "What does it feel like to see this place again?",
      choices: [
        { id: "a", label: "Grounding — it's good to be back", echo: "Something in you loosens. This is yours.", weights: { OPT: 2, RES: 1, SE: 1 }, next: "s4a" },
        { id: "b", label: "Strange — like returning to a stage set", echo: "It looks the same but something in you has shifted.", weights: { RUM: 1, ANX: 1 }, next: "s4b" },
        { id: "c", label: "Indifferent — a place is just a place", echo: "You walk past without slowing. It's just geography.", weights: { DEP: 1, SW: 1 }, next: "s4b" },
        { id: "d", label: "A small, quiet happiness at the ordinary things", echo: "The cat, the bakery sign — all of it gently good.", weights: { OPT: 2, ER: 1 }, next: "s4a" },
      ],
    },
    {
      id: "s4a",
      scene: "door",
      chapter: "Home",
      title: "The Key",
      paragraph:
        "You find your key on the first try. The door swings open. It smells like you left it — your particular air, your objects in their places. The stillness waits.",
      question: "You're home. What's the first thing you do?",
      choices: [
        { id: "a", label: "Drop everything and just sit — let it land", echo: "You sink into the chair and let yourself arrive.", weights: { ER: 2, RES: 1 }, next: "s5" },
        { id: "b", label: "Open windows, let fresh air in", echo: "You move through the flat, pulling light and air inside.", weights: { MOT: 1, OPT: 2 }, next: "s5" },
        { id: "c", label: "Check your phone — messages, emails, all of it", echo: "The world pours back in before you're ready.", weights: { ANX: 1, STR: 1 }, next: "s5" },
        { id: "d", label: "Start unpacking immediately", echo: "You go straight to work. Rest can wait.", weights: { MOT: 1, STR: 1, SE: -1 }, next: "s5" },
      ],
    },
    {
      id: "s4b",
      scene: "door",
      chapter: "Home",
      title: "Wrong Key",
      paragraph:
        "You reach for your key and freeze. The wrong one — you packed in a hurry and grabbed the spare from the wrong hook. A locksmith, a neighbour with the spare, or a very patient wait. All of it is manageable. Inconvenient, but manageable.",
      question: "Your first reaction?",
      choices: [
        { id: "a", label: "Problem-solve immediately — neighbour, locksmith, sorted", echo: "You move through the options calmly. It's fine.", weights: { RES: 3, ER: 2 }, next: "s5" },
        { id: "b", label: "Sit on the step and take a breath first", echo: "You let the frustration pass before you act.", weights: { ER: 2, RES: 1 }, next: "s5" },
        { id: "c", label: "A wave of disproportionate exhaustion — this tiny thing", echo: "It lands bigger than it should. You're more tired than you thought.", weights: { DEP: 2, STR: 1 }, next: "s5" },
        { id: "d", label: "Snap at yourself internally — of course you'd do this", echo: "The criticism arrives fast, without mercy.", weights: { SE: -2, RUM: 2 }, next: "s5" },
      ],
    },
    {
      id: "s5",
      scene: "bedroom",
      chapter: "Settling in",
      title: "Your Room",
      paragraph:
        "Your room looks exactly as you left it. The unmade corner of the duvet. The book face-down on the nightstand. It occurs to you that you've been carrying a version of this room in your head the whole time you were away.",
      question: "How does it feel to be in your own space again?",
      choices: [
        { id: "a", label: "Safe — like something exhaling", echo: "Your shoulders drop an inch you didn't notice carrying.", weights: { RES: 1, ER: 2, OPT: 1 }, next: "s6" },
        { id: "b", label: "You notice what needs doing and feel quietly guilty", echo: "The to-do list of your own home. You were hoping it wouldn't be this.", weights: { ANX: 1, RUM: 1 }, next: "s6" },
        { id: "c", label: "Empty — like the room and you are both hollowed out", echo: "You expected to feel more on arrival. That gap is its own feeling.", weights: { DEP: 3, MOT: -1 }, next: "s6" },
        { id: "d", label: "Comfortable but restless — you can't quite switch off", echo: "Home, but not quite landed. Your brain is still in transit.", weights: { STR: 2, ANX: 1 }, next: "s6" },
      ],
    },
    {
      id: "s6",
      scene: "kitchen",
      chapter: "First evening",
      title: "The Empty Fridge",
      paragraph:
        "The fridge is nearly empty — you left in a rush. There's half a jar of peanut butter, some crackers, and a very optimistic lemon. You could order delivery, go to the shop, or just make do.",
      question: "What do you do about dinner?",
      choices: [
        { id: "a", label: "Cook something from scratch — it feels like a ritual", echo: "You chop, you heat, you eat at your own table. A small ceremony.", weights: { MOT: 2, OPT: 1, SE: 1 }, next: "s7a" },
        { id: "b", label: "Order delivery — you've earned it", echo: "You tap the app without guilt. You're allowed to be taken care of.", weights: { SE: 1, ER: 1 }, next: "s7a" },
        { id: "c", label: "Snack on crackers and don't bother with a real meal", echo: "You eat standing over the sink. It doesn't matter.", weights: { DEP: 2, MOT: -1 }, next: "s7b" },
        { id: "d", label: "Realise you're not hungry — stress has closed your appetite", echo: "Your body has forgotten how to want normal things.", weights: { ANX: 1, STR: 2, DEP: 1 }, next: "s7b" },
      ],
    },
    {
      id: "s7a",
      scene: "phone",
      chapter: "Evening",
      title: "Someone Picks Up",
      paragraph:
        "Your phone rings — a friend who somehow always knows. \"You back? How was it?\" Their voice is ordinary and warm and exactly what you needed.",
      question: "How does the conversation go?",
      choices: [
        { id: "a", label: "You tell them the real version, including the hard parts", echo: "You let yourself be known. That takes something.", weights: { SW: -2, ER: 2, RES: 1 }, next: "s8" },
        { id: "b", label: "You give the edited version — fine, good, tired", echo: "You don't have the energy to explain, so you summarise.", weights: { SW: 1, AVO: 1 }, next: "s8" },
        { id: "c", label: "You're genuinely glad they called and it shows", echo: "The warmth is real and both of you feel it.", weights: { OPT: 2, SW: -1, SE: 1 }, next: "s8" },
        { id: "d", label: "You feel guilty for not having more to say", echo: "They're trying. You're just not there yet.", weights: { ANX: 1, SE: -1, RUM: 1 }, next: "s8" },
      ],
    },
    {
      id: "s7b",
      scene: "phone",
      chapter: "Evening",
      title: "Missed Call",
      paragraph:
        "Your phone lights up. Someone checking in. You look at the name, and your thumb just — doesn't move. You're not ready for words. The screen goes dark.",
      question: "How do you feel after you let it ring out?",
      choices: [
        { id: "a", label: "Relieved — you needed silence more than connection", echo: "The quiet feels like oxygen. You'll call back when you can.", weights: { AVO: 1, SW: 1 }, next: "s8" },
        { id: "b", label: "Guilty — you know they mean well", echo: "Their name sits on the screen like a small accusation.", weights: { RUM: 2, ANX: 1 }, next: "s8" },
        { id: "c", label: "Numb — neither relieved nor guilty, just nothing", echo: "The feeling is the absence of a feeling.", weights: { DEP: 3, SW: 2 }, next: "s8" },
        { id: "d", label: "You type a quick text: \"Home safe, talk soon\"", echo: "A small bridge. Not much, but enough.", weights: { ER: 1, SW: -1, OPT: 1 }, next: "s8" },
      ],
    },
    {
      id: "s8",
      scene: "window",
      chapter: "Night falling",
      title: "Looking Out",
      paragraph:
        "You find yourself standing at the window. The street below is ordinary evening — lights coming on, a couple arguing softly about something, someone walking a dog. All of it quietly beautiful and completely indifferent to your return.",
      question: "Standing here, what rises in you?",
      choices: [
        { id: "a", label: "A small, unexpected gratitude for being back", echo: "You didn't know how much you'd missed the ordinary.", weights: { OPT: 2, RES: 1, ER: 1 }, next: "s9a" },
        { id: "b", label: "Loneliness — right in the middle of all these people", echo: "The street is full and you are somehow still alone.", weights: { DEP: 2, SW: 2 }, next: "s9b" },
        { id: "c", label: "A restless urge to go out — you need noise and movement", echo: "Your legs want something your head can't name.", weights: { ANX: 1, MOT: 1 }, next: "s9a" },
        { id: "d", label: "Peace — just this, for now, is enough", echo: "The window is a good place to be. You let it be enough.", weights: { ER: 2, OPT: 1, SE: 1 }, next: "s9a" },
      ],
    },
    {
      id: "s9a",
      scene: "cafe",
      chapter: "Out",
      title: "The Neighbourhood",
      paragraph:
        "You pull on a coat and step out. The evening air is cool. You end up somewhere familiar — a corner café, a park bench, a bookshop that stays open late. Just you and the world, briefly.",
      question: "What do you do with this hour?",
      choices: [
        { id: "a", label: "Sit with a coffee and watch people — no phone", echo: "You people-watch until you feel like a person again.", weights: { ER: 2, OPT: 2, SE: 1 }, next: "s10" },
        { id: "b", label: "Walk with no destination", echo: "Aimless walking turns out to be the point.", weights: { RES: 1, OPT: 1, ER: 1 }, next: "s10" },
        { id: "c", label: "Browse, but your mind is elsewhere", echo: "Your body is out. Your mind never quite left the flat.", weights: { RUM: 2, ANX: 1 }, next: "s10" },
        { id: "d", label: "Call someone and talk while you walk", echo: "Movement and voice. Both help.", weights: { SW: -2, OPT: 1, RES: 1 }, next: "s10" },
      ],
    },
    {
      id: "s9b",
      scene: "mirror",
      chapter: "In",
      title: "Your Own Face",
      paragraph:
        "You catch your reflection passing the hallway mirror. You stop. There's something in your face you weren't expecting to see — not bad, not good, just real. You look at yourself for a moment longer than usual.",
      question: "What do you see?",
      choices: [
        { id: "a", label: "Someone who's been through something, still standing", echo: "The face that comes home isn't always the one that left.", weights: { RES: 2, SE: 1, OPT: 1 }, next: "s10" },
        { id: "b", label: "Someone tired in ways a night's sleep won't fix", echo: "The kind of tired that comes from the inside out.", weights: { DEP: 2, MOT: -1 }, next: "s10" },
        { id: "c", label: "Yourself — unremarkably, quietly yourself", echo: "You look and then move on. That's enough.", weights: { ER: 1, SE: 1 }, next: "s10" },
        { id: "d", label: "A stranger — you're not sure you recognise them today", echo: "The face is yours but it's wearing something unfamiliar.", weights: { DEP: 2, ANX: 1, RUM: 1 }, next: "s10" },
      ],
    },
    {
      id: "s10",
      scene: "phone",
      chapter: "Late evening",
      title: "The Thread",
      paragraph:
        "Scrolling through your phone, you come across an old message thread — someone you've been meaning to reach back out to. Months old. The last word was yours, and you never followed up.",
      question: "What do you do with it?",
      choices: [
        { id: "a", label: "Type something now — it's not too late", echo: "You write something real and press send. It's that simple.", weights: { SW: -2, MOT: 2, SE: 1, OPT: 1 }, next: "s11" },
        { id: "b", label: "Close the app — you'll do it when you're ready", echo: "Not yet. But you know you want to. That's something.", weights: { AVO: 1 }, next: "s11" },
        { id: "c", label: "Feel a pang of guilt and then scroll past", echo: "The feeling moves through you and you let it.", weights: { RUM: 2, SE: -1 }, next: "s11" },
        { id: "d", label: "Draft a message, then delete it before sending", echo: "You wrote it. That's further than you got last time.", weights: { ANX: 1, SE: -1, RES: 1 }, next: "s11" },
      ],
    },
    {
      id: "s11",
      scene: "night",
      chapter: "11:58 PM",
      title: "The Dark and the Quiet",
      paragraph:
        "You're in bed. The flat is dark and still. The first day back is almost over. Your mind is still moving through all of it — the arrivals hall, the window, the mirror, the message. You can feel sleep at the edge.",
      question: "What do you do with the day before you sleep?",
      choices: [
        { id: "a", label: "Let it go — good, hard, or mixed, it's done", echo: "You set it down like a bag at the door. Tomorrow is tomorrow.", weights: { ER: 3, RES: 2, OPT: 1, STR: -1 }, next: "END" },
        { id: "b", label: "Replay the harder moments, wondering what you should've done", echo: "Your mind doesn't close for business until it's filed everything twice.", weights: { RUM: 3, ANX: 2, SE: -1 }, next: "END" },
        { id: "c", label: "Focus on one good thing — there was always one", echo: "You find it. Small, real, yours.", weights: { OPT: 3, RES: 1, ER: 1 }, next: "END" },
        { id: "d", label: "Scroll until you pass out — let it be someone else's thoughts", echo: "The glow is kinder than the dark. You tell yourself that.", weights: { AVO: 2, ANX: 1 }, next: "END" },
      ],
    },
  ] as HomecomingScene[],
};

/* ============================================================
   Custom Scoring Profile for The Long Way Home
   ============================================================ */

const POS_ADJ: Record<Trait, string> = {
  RES: "Steady", OPT: "Hopeful", MOT: "Driven", ER: "Quiet", SE: "Confident",
  DEP: "", ANX: "", STR: "", SW: "", AVO: "", RUM: "",
};
const NEG_NOUN: Record<Trait, string> = {
  ANX: "Worrier", RUM: "Overthinker", DEP: "Dreamer", STR: "Keeper",
  SW: "Solitary", AVO: "Wanderer",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

const STRENGTH_LINE: Record<Trait, string> = {
  RES: "You bounce back. Setbacks bend you, but they don't keep you down.",
  OPT: "You expect light ahead — and that hope pulls you forward on hard days.",
  MOT: "You keep moving toward what matters, even when it would be easier to stop.",
  ER: "You feel things fully and still stay steady. That balance is rare.",
  SE: "You can hold a good word about yourself without flinching. That's real ground to stand on.",
  DEP: "", ANX: "", STR: "", SW: "", AVO: "", RUM: "",
};

const AREA_LINE: Record<Trait, string> = {
  DEP: "Transitions often feel heavier than they should. Small acts of grounding care matter more than they seem.",
  ANX: "Your mind scans for threats and braces early, especially in new or shifting spaces.",
  STR: "You carry the invisible logistics of settling in like a heavy weight. Some of that can wait.",
  SW: "You pull inward when you feel out of place — exactly when connection would anchor you.",
  AVO: "Unpacking the physical and emotional bags gets delayed. Momentum starts with just five minutes.",
  RUM: "Your mind replays awkward or solitary moments on a loop. It needs a gentle off-ramp.",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

const REC_LINE: Record<Trait, string> = {
  ANX: "Try 4-7-8 breathing the moment transition anxiety spikes.",
  STR: "Use box breathing before unpacking or organizing to steady your system.",
  RUM: "Set a 10-minute 'worry window,' then shift to one present-moment task like making tea.",
  DEP: "Pick one small, nourishing action a day to re-establish your routine.",
  SW: "Reach for one low-stakes connection daily: a text, a wave, a short call.",
  AVO: "Use the 'five-minute start' rule on anything you're putting off — even just opening the suitcase.",
  RES: "", OPT: "", MOT: "", ER: "", SE: "",
};

const HABIT_LINE: Record<Trait, string> = {
  ANX: "One round of 4-7-8 breathing when returning to an empty space.",
  STR: "A two-minute breathing break when your shoulders creep up.",
  RUM: "Write down the looping thought once, then close the notebook.",
  DEP: "One tiny win a day — make the bed, step outside, text a friend.",
  SW: "Reply to one person you've been meaning to answer.",
  AVO: "Start the dreaded task for five minutes only.",
  RES: "Name one thing that went right today.",
  OPT: "Notice one small good thing in your environment.",
  MOT: "Choose one meaningful task and do it first.",
  ER: "Label the feeling out loud before reacting.",
  SE: "Accept one compliment today without deflecting.",
};

function topTrait(t: Totals, pool: Trait[], preferHigh = true): Trait {
  return [...pool].sort((a, b) => (preferHigh ? t[b] - t[a] : t[a] - t[b]))[0];
}

export function buildHomecomingReport(picks: AChoice[]): Report {
  const totals = accumulate(picks);
  const w = wellness(totals);
  
  const pos = topTrait(totals, POSITIVE);
  const neg = topTrait(totals, NEGATIVE);
  const name = `The ${POS_ADJ[pos]} ${NEG_NOUN[neg]}`;
  const blurb = `You lead with ${TRAIT_META[pos].full.toLowerCase()} — it's the quiet engine underneath your transitions. At the same time, ${TRAIT_META[neg].full.toLowerCase()} tends to show up when you're trying to re-anchor yourself. Knowing both is how you start to feel at home again.`;

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
  const summary = `Returning home showed a real thread of ${leadStrength} running through you — hold onto that; it anchors you. ${leadArea.charAt(0).toUpperCase() + leadArea.slice(1)} asked for some of your attention too, and that's okay — transitions are heavy. Start small, be kind to yourself, and let one gentle habit lead the way.`;

  return { totals, wellness: w, profile: { name, blurb }, strengths, areas, habits, summary };
}
