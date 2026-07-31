"use client";

import Link from "next/link";
import SleepBarChart from "@/components/charts/SleepBarChart";
import { useSleepDashboard } from "@/lib/sleepStore";
import Button from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";
import styles from "./SleepSnapshot.module.css";

export default function SleepSnapshot() {
  const { chartData, avgSleepHours, hasLoggedToday } = useSleepDashboard();

  return (
    <div className={styles.snapshot}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.label}>Sleep Quality</h3>
          <span className={styles.sub}>Last 7 nights</span>
        </div>
        <div className={styles.stats}>
          <span className={styles.avgValue}>{avgSleepHours}</span>
          <span className={styles.avgLabel}>hr avg</span>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <SleepBarChart data={chartData} height={140} />
      </div>

      <div className={styles.footer}>
        {hasLoggedToday ? (
          <span style={{ fontSize: "0.85rem", color: "var(--accent-deep)", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <Check size={14} /> Logged today
          </span>
        ) : (
          <Button href="/sleep" variant="secondary" size="md" iconRight={<ArrowRight />}>
            Log sleep
          </Button>
        )}
      </div>
    </div>
  );
}
