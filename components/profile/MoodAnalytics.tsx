"use client";

import GlassCard from "@/components/ui/GlassCard";
import MoodLineChart from "@/components/charts/MoodLineChart";
import ReflectionPieChart from "@/components/charts/ReflectionPieChart";
import styles from "./MoodAnalytics.module.css";

type Props = {
  moodData: any[];
  mixData: any[];
};

export default function MoodAnalytics({ moodData, mixData }: Props) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Mood Analytics</h2>
      
      <div className={styles.grid}>
        <GlassCard className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Weekly Trend</h3>
            <p className={styles.cardSubtitle}>Your mood and calm levels</p>
          </div>
          <div className={styles.chartWrap}>
            <MoodLineChart data={moodData} height={200} />
          </div>
        </GlassCard>

        <GlassCard className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Mood Distribution</h3>
            <p className={styles.cardSubtitle}>What you've been feeling</p>
          </div>
          <div className={styles.chartWrap}>
            <ReflectionPieChart data={mixData} height={200} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
