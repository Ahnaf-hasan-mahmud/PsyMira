"use client";

import GlassCard from "@/components/ui/GlassCard";
import styles from "./EmotionalInsights.module.css";

type Props = {
  mixData: { name: string; value: number; color: string }[];
};

export default function EmotionalInsights({ mixData }: Props) {
  // Filter out the 0 value empty states and get the top 3 traits
  const traits = mixData.filter(m => m.value > 0).sort((a, b) => b.value - a.value).slice(0, 3);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("calm")) return "🧘";
    if (n.includes("courage")) return "🦁";
    if (n.includes("empathy")) return "❤️";
    if (n.includes("optimism")) return "☀️";
    if (n.includes("resilience")) return "🛡️";
    if (n.includes("joy") || n.includes("happy")) return "😊";
    return "✨";
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Emotional Insights</h2>
      <p className={styles.subtitle}>Your top emotional traits based on your activity</p>
      
      <div className={styles.grid}>
        {traits.length === 0 ? (
          <div className={styles.empty}>Complete more stories and check-ins to unlock insights!</div>
        ) : (
          traits.map((trait, i) => (
            <GlassCard key={i} className={styles.card} pad="sm" style={{ borderTop: `4px solid ${trait.color}` }}>
              <div className={styles.icon}>{getIcon(trait.name)}</div>
              <div className={styles.name}>{trait.name}</div>
              <div className={styles.value}>{trait.value}% dominance</div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
