"use client";

import GlassCard from "@/components/ui/GlassCard";
import styles from "./FavoriteActivities.module.css";

type Props = {
  mostLoggedMood: string;
  favBreathing: string;
  favStory: string;
  favGame: string;
};

export default function FavoriteActivities({ mostLoggedMood, favBreathing, favStory, favGame }: Props) {
  const FAVES = [
    { title: "Most Logged Mood", value: mostLoggedMood, icon: "😊" },
    { title: "Favorite Breathing", value: favBreathing !== "None" ? favBreathing : "Not enough data", icon: "🌬️" },
    { title: "Favorite Story Theme", value: favStory !== "None" ? favStory : "Not enough data", icon: "📖" },
    { title: "Favorite Game", value: favGame !== "None" ? favGame : "Not enough data", icon: "🎮" },
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Your Favorites</h2>
      <div className={styles.grid}>
        {FAVES.map((f, i) => (
          <GlassCard key={i} className={styles.card} pad="sm">
            <div className={styles.icon}>{f.icon}</div>
            <div className={styles.info}>
              <span className={styles.label}>{f.title}</span>
              <span className={styles.value}>{f.value}</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
