"use client";

import GlassCard from "@/components/ui/GlassCard";
import styles from "./WellnessSummary.module.css";
import type { Activity } from "@/lib/activityStore";

type Props = {
  activities: Activity[];
  consistency: number;
};

export default function WellnessSummary({ activities, consistency }: Props) {
  const stories = activities.filter(a => a.kind === "story").length;
  const breathing = activities.filter(a => a.kind === "breathing").length;
  const games = activities.filter(a => a.kind === "game").length;
  const moods = activities.filter(a => a.kind === "mood" || a.mood > 0).length;

  const STATS = [
    { label: "Mood Logs", value: moods, icon: "😊", color: "text-amber-500" },
    { label: "Breathing", value: breathing, icon: "🌬️", color: "text-blue-400" },
    { label: "Stories", value: stories, icon: "📖", color: "text-purple-400" },
    { label: "Games", value: games, icon: "🎮", color: "text-pink-400" },
    { label: "Weekly Consistency", value: `${consistency}%`, icon: "🔥", color: "text-orange-500" },
    { label: "Total Sessions", value: activities.length, icon: "✨", color: "text-indigo-400" }
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Wellness Summary</h2>
      <div className={styles.grid}>
        {STATS.map((s, i) => (
          <GlassCard key={i} className={styles.card} pad="sm">
            <div className={styles.icon}>{s.icon}</div>
            <div className={styles.value}>{s.value}</div>
            <div className={styles.label}>{s.label}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
