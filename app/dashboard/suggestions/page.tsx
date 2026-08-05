"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useActivityDashboard } from "@/lib/activityStore";
import { useSleepDashboard } from "@/lib/sleepStore";
import { useDiaryEntries } from "@/lib/diaryStore";
import {
  Wind,
  Moon,
  Book,
  Waves,
  Gamepad,
  Feather,
  Lightbulb,
  AlertTriangle,
  Heart,
  Sparkle,
  ArrowRight,
} from "@/components/ui/Icons";
import styles from "./page.module.css";

// ─── Suggestion type ────────────────────────────────────────────────────────
type Urgency = "critical" | "warning" | "suggestion" | "tip";

type Suggestion = {
  id: string;
  urgency: Urgency;
  emoji: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function avgLast3Days(moodData: { mood: number; calm: number }[]): {
  mood: number;
  calm: number;
} {
  const slice = moodData.slice(-3).filter((d) => d.mood > 0 || d.calm > 0);
  if (!slice.length) return { mood: 0, calm: 0 };
  return {
    mood: slice.reduce((s, d) => s + d.mood, 0) / slice.length,
    calm: slice.reduce((s, d) => s + d.calm, 0) / slice.length,
  };
}

function daysSince(isoStr: string): number {
  return Math.floor(
    (Date.now() - new Date(isoStr).getTime()) / (1000 * 60 * 60 * 24)
  );
}

// ─── Priority engine ─────────────────────────────────────────────────────────
function buildSuggestions(
  activity: ReturnType<typeof useActivityDashboard>,
  sleep: ReturnType<typeof useSleepDashboard>,
  diaryEntries: ReturnType<typeof useDiaryEntries>
): Suggestion[] {
  const candidates: Suggestion[] = [];

  const { totalActivities, breathingRounds, completedStories, moodData, consistency, activities } =
    activity;
  const { avgSleepHours, recentEntries } = sleep;
  const last3 = avgLast3Days(moodData);
  const poorNights = recentEntries.filter((e) => e.quality === "poor").length;
  const gamesPlayed = activities.filter((a) => a.kind === "game").length;
  const lastDiary = diaryEntries[0];
  const daysSinceDiary = lastDiary ? daysSince(lastDiary.updatedAt) : 999;

  // ── CRITICAL urgency ─────────────────────────────────────────────────────
  // Sleep critically low → medical suggestion
  if (avgSleepHours > 0 && avgSleepHours < 4.5) {
    candidates.push({
      id: "sleep-critical",
      urgency: "critical",
      emoji: "🚨",
      title: "Severely sleep deprived",
      body: `You've averaged only ${avgSleepHours} hrs of sleep this week — dangerously below the healthy range. Chronic sleep deprivation can seriously harm your health. Please consult a doctor or healthcare professional.`,
      cta: "Log tonight's sleep",
      href: "/sleep",
    });
  }

  // Stress critically high
  if (last3.calm > 0 && last3.calm < 25) {
    candidates.push({
      id: "stress-critical",
      urgency: "critical",
      emoji: "🆘",
      title: "Stress levels are very high",
      body: `Your calm scores have been critically low (avg ${Math.round(last3.calm)}%) for the past few days. This level of sustained stress can affect your physical health. Please consider speaking to a mental health professional.`,
      cta: "Try breathing exercises",
      href: "/breathing",
    });
  }

  // Mood severely low
  if (last3.mood > 0 && last3.mood < 30) {
    candidates.push({
      id: "mood-critical",
      urgency: "critical",
      emoji: "💙",
      title: "Your mood needs support",
      body: `Your mood has been very low this week (avg ${Math.round(last3.mood)}%). You don't have to go through this alone. Please reach out to a trusted person or a mental health professional.`,
      cta: "Listen to calming music",
      href: "/relaxation",
    });
  }

  // ── WARNING urgency ───────────────────────────────────────────────────────
  // New user — no activities at all
  if (totalActivities === 0) {
    candidates.push({
      id: "new-user",
      urgency: "warning",
      emoji: "👋",
      title: "Let's learn about you",
      body: "You're just getting started! Reading an interactive story is the best first step — it helps us understand your emotional patterns so we can give you personalised suggestions.",
      cta: "Begin a story",
      href: "/story",
    });
  }

  // Sleep quite low
  if (avgSleepHours >= 4.5 && avgSleepHours < 6) {
    candidates.push({
      id: "sleep-low",
      urgency: "warning",
      emoji: "😴",
      title: "Not enough sleep",
      body: `You've averaged ${avgSleepHours} hrs this week — below the healthy 7–8 hour range. Try winding down with ambient sounds tonight.`,
      cta: "Sleep sounds",
      href: "/relaxation",
    });
  }

  // Moderate stress
  if (last3.calm >= 25 && last3.calm < 45) {
    candidates.push({
      id: "stress-moderate",
      urgency: "warning",
      emoji: "😤",
      title: "Stress has been elevated",
      body: `Your calm score averaged ${Math.round(last3.calm)}% over the past 3 days. A quick breathing session can bring it down in under 5 minutes.`,
      cta: "Try breathing",
      href: "/breathing",
    });
  }

  // Mood moderate low
  if (last3.mood >= 30 && last3.mood < 52) {
    candidates.push({
      id: "mood-low",
      urgency: "warning",
      emoji: "🌧️",
      title: "Mood has been lower lately",
      body: `Your mood averaged ${Math.round(last3.mood)}% this week. A stress-relief game or some calming music can help shift your energy.`,
      cta: "Play a game",
      href: "/games",
    });
  }

  // ── SUGGESTION urgency ────────────────────────────────────────────────────
  // Sleep borderline
  if (avgSleepHours >= 6 && avgSleepHours < 7) {
    candidates.push({
      id: "sleep-borderline",
      urgency: "suggestion",
      emoji: "🌙",
      title: "Sleep could be better",
      body: `You're averaging ${avgSleepHours} hrs — just short of the recommended 7–8 hrs. Even an extra 30 minutes makes a real difference. Try setting a consistent bedtime.`,
      cta: "Track your sleep",
      href: "/sleep",
    });
  }

  // Poor sleep quality
  if (poorNights >= 2) {
    candidates.push({
      id: "sleep-quality",
      urgency: "suggestion",
      emoji: "🛌",
      title: "Sleep quality has been poor",
      body: `${poorNights} of your recent nights were poor quality. Ambient sounds like rain or ocean waves before bed can help you fall into deeper sleep.`,
      cta: "Wind-down sounds",
      href: "/relaxation",
    });
  }

  // Never tried breathing
  if (breathingRounds === 0) {
    candidates.push({
      id: "breathing-new",
      urgency: "suggestion",
      emoji: "🌬️",
      title: "Try a breathing exercise",
      body: "You haven't tried a breathing exercise yet. Box breathing is scientifically proven to calm the nervous system in just 4 minutes.",
      cta: "Try breathing",
      href: "/breathing",
    });
  }

  // Low consistency
  if (consistency < 40 && totalActivities > 0) {
    candidates.push({
      id: "consistency",
      urgency: "suggestion",
      emoji: "📅",
      title: "Build a daily habit",
      body: `You've been active ${Math.round(consistency)}% of this week. Even a 2-minute mood check-in counts! Small daily actions compound over time.`,
      cta: "Log your mood",
      href: "/dashboard",
    });
  }

  // No journal in 3+ days
  if (daysSinceDiary >= 3 && totalActivities > 0) {
    candidates.push({
      id: "journal",
      urgency: "suggestion",
      emoji: "📝",
      title: "Time to journal",
      body: `You haven't written in your journal for ${daysSinceDiary === 999 ? "a while" : `${daysSinceDiary} days`}. Writing about your day is one of the most effective ways to process emotions.`,
      cta: "Open journal",
      href: "/dashboard/journal",
    });
  }

  // Never played a game
  if (gamesPlayed === 0 && totalActivities > 0) {
    candidates.push({
      id: "games-new",
      urgency: "suggestion",
      emoji: "🎮",
      title: "Try a stress-relief game",
      body: "You haven't tried a game yet. Bubble Pop is surprisingly effective for resetting your mental state after a tense day — give it 2 minutes.",
      cta: "Play Bubble Pop",
      href: "/games/bubbles",
    });
  }

  // ── TIP (positive fallback) ────────────────────────────────────────────────
  if (completedStories.size > 0 && totalActivities > 0) {
    candidates.push({
      id: "explore-stories",
      urgency: "tip",
      emoji: "✨",
      title: "Explore another story",
      body: "Your stats look balanced — great work! Dive into a new story to earn XP and discover more about yourself.",
      cta: "Browse stories",
      href: "/story",
    });
  }

  // Always include a fallback tip
  candidates.push({
    id: "wellbeing-tip",
    urgency: "tip",
    emoji: "💚",
    title: "Keep it up",
    body: "Consistency is the key to wellbeing. Even small daily check-ins help you spot patterns and stay on track.",
    cta: "Explore features",
    href: "/dashboard",
  });

  // Priority order
  const order: Urgency[] = ["critical", "warning", "suggestion", "tip"];
  candidates.sort(
    (a, b) => order.indexOf(a.urgency) - order.indexOf(b.urgency)
  );

  // Return top 3 (but always at least 1 critical if present)
  const criticals = candidates.filter((c) => c.urgency === "critical");
  if (criticals.length > 0) {
    const rest = candidates.filter((c) => c.urgency !== "critical").slice(0, 2);
    return [...criticals.slice(0, 2), ...rest].slice(0, 3);
  }
  return candidates.slice(0, 3);
}

// ─── Urgency colours ─────────────────────────────────────────────────────────
const URGENCY_META: Record<
  Urgency,
  { accent: string; badge: string; badgeText: string; Icon: typeof AlertTriangle }
> = {
  critical: {
    accent: "#ef4444",
    badge: "rgba(239,68,68,0.12)",
    badgeText: "Needs attention",
    Icon: AlertTriangle,
  },
  warning: {
    accent: "#f59e0b",
    badge: "rgba(245,158,11,0.12)",
    badgeText: "Recommendation",
    Icon: Lightbulb,
  },
  suggestion: {
    accent: "#8b5cf6",
    badge: "rgba(139,92,246,0.12)",
    badgeText: "Suggestion",
    Icon: Lightbulb,
  },
  tip: {
    accent: "#10b981",
    badge: "rgba(16,185,129,0.12)",
    badgeText: "Tip",
    Icon: Heart,
  },
};

// ─── Card component ───────────────────────────────────────────────────────────
function SuggestionCard({
  suggestion,
  index,
}: {
  suggestion: Suggestion;
  index: number;
}) {
  const meta = URGENCY_META[suggestion.urgency];
  const { Icon } = meta;

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ "--card-accent": meta.accent } as React.CSSProperties}
    >
      <div className={styles.cardAccentBar} />
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <span className={styles.cardEmoji}>{suggestion.emoji}</span>
          <span
            className={styles.badge}
            style={{ background: meta.badge, color: meta.accent }}
          >
            <Icon size={13} /> {meta.badgeText}
          </span>
        </div>
        <h3 className={styles.cardTitle}>{suggestion.title}</h3>
        <p className={styles.cardBody}>{suggestion.body}</p>
        <Link href={suggestion.href} className={styles.cardCta}>
          {suggestion.cta} <ArrowRight size={15} />
        </Link>
      </div>
    </motion.article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SuggestionsPage() {
  const activity = useActivityDashboard();
  const sleep = useSleepDashboard();
  const diaryEntries = useDiaryEntries();

  const suggestions = useMemo(
    () => buildSuggestions(activity, sleep, diaryEntries),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activity.totalActivities, activity.consistency, sleep.avgSleepHours, diaryEntries.length]
  );

  return (
    <main className={styles.page}>
      {/* ── Header ── */}
      <motion.header
        className={styles.header}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.headerIcon}>
          <Lightbulb size={28} />
        </div>
        <div>
          <h1 className={styles.heading}>What to do today?</h1>
          <p className={styles.subheading}>
            Personalised nudges based on your real stats — mood, sleep, and activity patterns.
          </p>
        </div>
      </motion.header>

      {/* ── Stats summary row ── */}
      <motion.div
        className={styles.statsRow}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className={styles.stat}>
          <Moon size={16} />
          <span>
            <strong>{sleep.avgSleepHours || "—"}</strong> hrs avg sleep
          </span>
        </div>
        <div className={styles.stat}>
          <Heart size={16} />
          <span>
            <strong>
              {activity.moodData.slice(-3).filter((d) => d.mood > 0).length > 0
                ? Math.round(
                    activity.moodData
                      .slice(-3)
                      .filter((d) => d.mood > 0)
                      .reduce((s, d) => s + d.mood, 0) /
                      activity.moodData.slice(-3).filter((d) => d.mood > 0).length
                  )
                : "—"}
            </strong>{" "}
            mood score
          </span>
        </div>
        <div className={styles.stat}>
          <Sparkle size={16} />
          <span>
            <strong>{activity.consistency}%</strong> consistency
          </span>
        </div>
      </motion.div>

      {/* ── Suggestion cards ── */}
      <section className={styles.grid} aria-label="Today's suggestions">
        {suggestions.map((s, i) => (
          <SuggestionCard key={s.id} suggestion={s} index={i} />
        ))}
      </section>

      {/* ── Disclaimer for critical urgency ── */}
      {suggestions.some((s) => s.urgency === "critical") && (
        <motion.div
          className={styles.disclaimer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AlertTriangle size={15} />
          <span>
            PsyMira is a self-care tool and is <strong>not</strong> a substitute for professional
            medical or mental health care. If you are in crisis, please call your local emergency
            services or a crisis helpline.
          </span>
        </motion.div>
      )}

      {/* ── All features quick access ── */}
      <motion.section
        className={styles.allFeatures}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        aria-label="All features"
      >
        <h2 className={styles.featuresTitle}>Explore all features</h2>
        <div className={styles.featuresGrid}>
          {[
            { label: "Stories", icon: Book, href: "/story", desc: "Interactive self-reflection" },
            { label: "Breathing", icon: Wind, href: "/breathing", desc: "Calm your nervous system" },
            { label: "Relaxation", icon: Waves, href: "/relaxation", desc: "Ambient soundscapes" },
            { label: "Games", icon: Gamepad, href: "/games", desc: "Stress-relief mini games" },
            { label: "Sleep", icon: Moon, href: "/sleep", desc: "Track your sleep patterns" },
            { label: "Journal", icon: Feather, href: "/dashboard/journal", desc: "Daily reflection" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <Link key={f.label} href={f.href} className={styles.featureChip}>
                <span className={styles.chipIcon}>
                  <Icon size={18} />
                </span>
                <span>
                  <span className={styles.chipLabel}>{f.label}</span>
                  <span className={styles.chipDesc}>{f.desc}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </motion.section>
    </main>
  );
}
