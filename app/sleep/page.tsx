"use client";

import { useState, useCallback, FormEvent, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { Close } from "@/components/ui/Icons";
import ParticleField from "@/components/illustrations/ParticleField";
import { recordSleep, SleepQuality, useSleepDashboard } from "@/lib/sleepStore";
import SleepBarChart from "@/components/charts/SleepBarChart";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "./page.module.css";

const QUALITY_EMOJIS: Record<SleepQuality, string> = {
  poor: "🥱",
  okay: "😐",
  good: "🙂",
  great: "😄",
};

export default function SleepPage() {
  const { entries, hasLoggedToday, avgSleepHours, chartData } = useSleepDashboard();
  
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<SleepQuality | null>(null);
  
  // Format dates for the form
  const todayDate = new Date();
  const yestDate = new Date(todayDate);
  yestDate.setDate(yestDate.getDate() - 1);
  const todayStr = todayDate.toISOString().split("T")[0];

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!quality) return;

    recordSleep({
      date: todayStr,
      bedtime,
      wakeTime,
      quality,
    });
  }, [bedtime, wakeTime, quality, todayStr]);

  return (
    <main className={styles.page}>
      <ParticleField count={25} className={styles.particles} />

      <header className={styles.bar}>
        <Logo />
        <Link href="/dashboard" className={styles.exit} aria-label="Back to dashboard">
          <Close size={20} />
        </Link>
      </header>

      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={styles.title}>Sleep Tracker</h1>
          <p className={styles.subtitle}>How is your rest affecting your days?</p>
        </motion.div>

        <motion.div
          className={styles.analyticsCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.analyticsHead}>
            <div>
              <h2 className={styles.cardTitle}>7-Day Trend</h2>
              <span className={styles.cardSub}>Hours of sleep per night</span>
            </div>
            <div className={styles.avgBox}>
              <span className={styles.avgValue}>{avgSleepHours}</span>
              <span className={styles.avgLabel}>hr avg</span>
            </div>
          </div>
          <div className={styles.chartWrap}>
            <SleepBarChart data={chartData} height={180} />
          </div>
        </motion.div>

        <motion.form 
          className={styles.form}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {hasLoggedToday ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <span style={{ fontSize: "3rem" }}>✨</span>
              <h2 style={{ marginTop: 16, fontSize: "1.2rem", fontWeight: 600 }}>Sleep logged for today</h2>
              <p style={{ marginTop: 8, color: "var(--text-secondary)" }}>
                You can log again tomorrow morning.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.timeInputs}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Bedtime</label>
                  <input 
                    type="time" 
                    className={styles.timePicker} 
                    value={bedtime}
                    onChange={(e) => setBedtime(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Wake Time</label>
                  <input 
                    type="time" 
                    className={styles.timePicker} 
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.qualityGroup}>
                <label className={styles.label}>Quality</label>
                <div className={styles.qualityOptions}>
                  {(Object.keys(QUALITY_EMOJIS) as SleepQuality[]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      className={styles.qualityBtn}
                      data-active={quality === q}
                      onClick={() => setQuality(q)}
                    >
                      <span className={styles.qualityEmoji}>{QUALITY_EMOJIS[q]}</span>
                      <span className={styles.qualityLabel}>
                        {q.charAt(0).toUpperCase() + q.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.submitBtn}>
                <Button type="submit" disabled={!quality} style={{ width: "100%" }}>
                  Save Sleep Log
                </Button>
              </div>
            </>
          )}
        </motion.form>

        <motion.div 
          className={styles.history}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className={styles.cardTitle}>Recent History</h2>
          
          <div className={styles.historyList}>
            <AnimatePresence>
              {[...entries].reverse().slice(0, 7).map((entry, i) => (
                <motion.div 
                  key={entry.id} 
                  className={styles.historyCard}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div>
                    <div className={styles.historyDate}>
                      {new Date(entry.date).toLocaleDateString("en-US", { 
                        weekday: "short", 
                        month: "short", 
                        day: "numeric" 
                      })}
                    </div>
                    <div className={styles.historyTimes}>
                      {entry.bedtime} – {entry.wakeTime}
                    </div>
                  </div>
                  <div className={styles.historyStats}>
                    <span className={styles.historyHours}>{entry.hoursSlept}h</span>
                    <span className={styles.historyEmoji}>{QUALITY_EMOJIS[entry.quality]}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {entries.length === 0 && (
              <p style={{ color: "var(--text-secondary)", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                No sleep history yet. Log your sleep tomorrow morning!
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
