"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TopNav from "@/components/dashboard/TopNav";
import { ArrowRight, Book, Compass, Wind } from "@/components/ui/Icons";
import { type Activity, useActivityDashboard } from "@/lib/activityStore";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "../tracker.module.css";

export default function InsightsPage() {
  const data = useActivityDashboard();
  const completed = data.activities.filter(
    (activity) => activity.kind === "story" || activity.kind === "breathing"
  );

  const days = useMemo(() => {
    const grouped = new Map<string, Activity[]>();
    completed.forEach((activity) => {
      const key = activity.createdAt.slice(0, 10);
      grouped.set(key, [...(grouped.get(key) ?? []), activity]);
    });
    return [...grouped.entries()].sort(([a], [b]) => b.localeCompare(a));
  }, [completed]);

  const storyCount = completed.filter((item) => item.kind === "story").length;
  const breathingCount = completed.filter((item) => item.kind === "breathing").length;
  const activeDays = days.length;

  return (
    <>
      <TopNav name="Aria" />
      <motion.main className={styles.page} variants={stagger(0.08)} initial="hidden" animate="show">
        <motion.header className={styles.hero} variants={fadeUp}>
          <span className={styles.eyebrow}><Compass size={16} /> Activity insights</span>
          <h1 className={styles.title}>See your mindful rhythm.</h1>
          <p className={styles.lede}>
            Follow which days you completed a story or practiced a breathing exercise.
          </p>
        </motion.header>

        <motion.section className={styles.summaryGrid} variants={fadeUp}>
          <SummaryCard value={activeDays} label="Active days" />
          <SummaryCard value={storyCount} label="Stories completed" />
          <SummaryCard value={breathingCount} label="Breathing rounds" />
          <SummaryCard value={`${data.consistency}%`} label="Weekly consistency" />
        </motion.section>

        <motion.section className={styles.timelinePanel} variants={fadeUp}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.smallLabel}>Exercise history</span>
              <h2 className={styles.sectionTitle}>What you practiced each day</h2>
            </div>
          </div>

          {days.length ? (
            <div className={styles.timeline}>
              {days.map(([date, activities]) => (
                <article className={styles.dayGroup} key={date}>
                  <div className={styles.dayDate}>
                    <span className={styles.dayNumber}>{new Date(`${date}T12:00:00`).getDate()}</span>
                    <span>
                      <strong>{new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" })}</strong>
                      <small>{new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</small>
                    </span>
                  </div>
                  <div className={styles.dayActivities}>
                    {activities.map((activity) => (
                      <div className={styles.activityItem} key={activity.id}>
                        <span className={`${styles.activityIcon} ${activity.kind === "breathing" ? styles.breathIcon : styles.storyIcon}`}>
                          {activity.kind === "breathing" ? <Wind size={18} /> : <Book size={18} />}
                        </span>
                        <div className={styles.activityCopy}>
                          <strong>{activity.title}</strong>
                          <span>
                            {activity.kind === "breathing"
                              ? `${activity.technique} · ${Math.max(1, Math.round(activity.minutes))} min`
                              : `Story reflection · ${Math.round(activity.minutes)} min`}
                          </span>
                        </div>
                        <time>{new Date(activity.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</time>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.insightEmpty}>
              <span className={styles.emptyOrb}><Wind size={24} /></span>
              <h3>Your activity timeline is ready.</h3>
              <p>Complete a full breathing round or finish a story to add your first insight.</p>
              <div className={styles.emptyActions}>
                <Link href="/breathing">Start breathing <ArrowRight size={15} /></Link>
                <Link href="/story">Choose a story <ArrowRight size={15} /></Link>
              </div>
            </div>
          )}
        </motion.section>
      </motion.main>
    </>
  );
}

function SummaryCard({ value, label }: { value: number | string; label: string }) {
  return <div className={styles.summaryCard}><strong>{value}</strong><span>{label}</span></div>;
}
