"use client";

import { useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Close, Moon, Sparkle } from "@/components/ui/Icons";
import ParticleField from "@/components/illustrations/ParticleField";
import { recordSleep, SleepQuality, useSleepDashboard } from "@/lib/sleepStore";
import SleepBarChart from "@/components/charts/SleepBarChart";
import styles from "./page.module.css";

const QUALITIES: { value: SleepQuality; label: string }[] = [
  { value: "poor", label: "Poor" },
  { value: "okay", label: "Fair" },
  { value: "good", label: "Good" },
  { value: "great", label: "Excellent" },
];

export default function SleepPage() {
  const { entries, hasLoggedToday, avgSleepHours, chartData } = useSleepDashboard();
  
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<SleepQuality | null>(null);
  
  const todayStr = new Date().toISOString().split("T")[0];

  // Calculate nights under 6h
  const nightsUnder6 = entries.slice(-7).filter(e => e.hoursSlept < 6).length;

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



      <div className={styles.container}>
        {/* ── Page Header ── */}
        <motion.header 
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.moonIcon}>
            <Moon size={24} />
          </div>
          <div className={styles.headerContent}>
            <h2 className={styles.supertitle}>REST AND RECOVERY</h2>
            <h1 className={styles.title}>Sleep Tracker</h1>
            <p className={styles.subtitle}>
              Log how long and how well you slept. PsyMira tracks your nights so you can understand the connection between your rest and your daily wellbeing.
            </p>
          </div>
        </motion.header>

        {/* ── Two Column Grid ── */}
        <div className={styles.grid}>
          {/* Left Column: Logging Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.card}>
              {!hasLoggedToday ? (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.cardHead}>
                    <h3 className={styles.cardTitle}>Last night</h3>
                    <p className={styles.cardSub}>Log it while it is still fresh.</p>
                  </div>

                  {/* Bedtime & Wake Time */}
                  <div className={styles.timeInputs}>
                    <div className={styles.inputGroup}>
                      <span className={styles.label}>Bedtime</span>
                      <input
                        type="time"
                        value={bedtime}
                        onChange={(e) => setBedtime(e.target.value)}
                        required
                        className={styles.timePicker}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <span className={styles.label}>Wake Time</span>
                      <input
                        type="time"
                        value={wakeTime}
                        onChange={(e) => setWakeTime(e.target.value)}
                        required
                        className={styles.timePicker}
                      />
                    </div>
                  </div>

                  {/* Quality Selector */}
                  <div className={styles.qualityGroup}>
                    <span className={styles.label}>Quality</span>
                    <div className={styles.qualityOptions}>
                      {QUALITIES.map((q) => (
                        <button
                          key={q.value}
                          type="button"
                          className={styles.qualityBtn}
                          data-active={quality === q.value}
                          onClick={() => setQuality(q.value)}
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={styles.submitWrap}>
                    <button 
                      type="submit" 
                      className={styles.logBtn}
                      disabled={!quality}
                    >
                      Log sleep
                    </button>

                    <div className={styles.summaryBox}>
                      <span>Average across 7 nights: <strong>{avgSleepHours || "—"}h</strong></span>
                      <span>Nights under 6h: <strong>{nightsUnder6}</strong></span>
                    </div>
                  </div>
                </form>
              ) : (
                <div className={styles.loggedState}>
                  <div className={styles.loggedIcon}>
                    <Sparkle size={32} />
                  </div>
                  <h2>All set for today</h2>
                  <p>Your sleep has been recorded successfully.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={styles.chartCard}
          >
            <div className={styles.card} style={{ height: "100%" }}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Sleep duration</h3>
                <p className={styles.cardSub}>Hours per night.</p>
              </div>

              {chartData.length > 0 ? (
                <div className={styles.chartWrap}>
                  <SleepBarChart data={chartData} height={250} theme="light" />
                </div>
              ) : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Log two nights to see the chart.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── 7-Day History ── */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={`${styles.card} ${styles.historyCard}`}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>Last 7 Days</h3>
                <p className={styles.cardSub}>Your recent sleep history.</p>
              </div>
              <div className={styles.historyList}>
                {[...entries].reverse().slice(0, 7).map((entry) => {
                  const q = QUALITIES.find((x) => x.value === entry.quality);
                  return (
                    <div key={entry.date} className={styles.historyRow}>
                      <span className={styles.historyDate}>
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className={styles.historyDetails}>
                        <span className={styles.historyHours}>{entry.hoursSlept}h</span>
                        <span className={styles.historyTimes}>
                          {entry.bedtime} - {entry.wakeTime}
                        </span>
                        <span className={styles.historyQuality}>{q?.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
