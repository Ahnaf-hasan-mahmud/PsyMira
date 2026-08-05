"use client";

import GlassCard from "@/components/ui/GlassCard";
import styles from "./RecentTimeline.module.css";
import type { Activity } from "@/lib/activityStore";

export default function RecentTimeline({ activities }: { activities: Activity[] }) {
  const recent = [...activities].reverse().slice(0, 5);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000 && now.getDate() === d.getDate()) return "Today";
    if (diff < 172800000 && now.getDate() - d.getDate() === 1) return "Yesterday";
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getIcon = (kind: string) => {
    if (kind === "mood") return "😊";
    if (kind === "breathing") return "🌬️";
    if (kind === "story") return "📖";
    if (kind === "game") return "🎮";
    return "✨";
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Recent Activity</h2>
      <GlassCard className={styles.card}>
        {recent.length === 0 ? (
          <div className={styles.empty}>No recent activity found.</div>
        ) : (
          <div className={styles.timeline}>
            {recent.map(a => (
              <div key={a.id} className={styles.item}>
                <div className={styles.icon}>{getIcon(a.kind)}</div>
                <div className={styles.content}>
                  <div className={styles.top}>
                    <span className={styles.type}>{a.kind.charAt(0).toUpperCase() + a.kind.slice(1)} Session</span>
                    <span className={styles.time}>{formatTime(a.createdAt)}</span>
                  </div>
                  <div className={styles.detail}>
                    {a.title || a.technique || a.emotion || "Completed a check-in"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
