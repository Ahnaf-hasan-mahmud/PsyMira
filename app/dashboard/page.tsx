"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import TopNav from "@/components/dashboard/TopNav";
import MoodLineChart from "@/components/charts/MoodLineChart";
import ActivityBarChart from "@/components/charts/ActivityBarChart";
import ReflectionPieChart from "@/components/charts/ReflectionPieChart";
import ConsistencyRing from "@/components/charts/ConsistencyRing";
import GrowthTree from "@/components/illustrations/GrowthTree";
import Button from "@/components/ui/Button";
import { ArrowRight, Flame, Trophy, Play, Eye, Check, Wind, Sparkle } from "@/components/ui/Icons";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { recordActivity, useActivityDashboard } from "@/lib/activityStore";
import styles from "./page.module.css";

export default function DashboardPage() {
  const data = useActivityDashboard();
  const [moodSaved, setMoodSaved] = useState<string | null>(null);
  const xpTarget = Math.max(400, Math.ceil((data.xp + 1) / 400) * 400);
  const level = Math.max(1, Math.floor(data.xp / 400) + 1);
  const xpPercent = Math.min(100, (data.xp / xpTarget) * 100);

  function checkIn(mood: (typeof MOODS)[number]) {
    recordActivity({
      kind: "mood",
      minutes: 1,
      mood: mood.mood,
      calm: mood.calm,
      emotion: mood.label,
      title: "Daily mood check-in",
    });
    setMoodSaved(mood.label);
  }

  return (
    <>
      <TopNav name="Aria" />

      <motion.div
        variants={stagger(0.08)}
        initial="hidden"
        animate="show"
        className={styles.flow}
      >
        {/* ---- Top row: welcome + journey + today ---- */}
        <div className={styles.topRow}>
          <motion.section className={styles.welcome} variants={fadeUp}>
            <div className={styles.welcomeGlow} />
            <span className={styles.welcomeEyebrow}>Today's invitation</span>
            <h2 className={styles.welcomeTitle}>
              Take a breath.
              <br />
              Your next story is waiting.
            </h2>
            <p className={styles.welcomeBody}>
              {data.totalActivities > 0
                ? `You have completed ${data.totalActivities} mindful activities. Your next reflection is waiting.`
                : "Begin with a story, a mood check-in, or one calming round of guided breathing."}
            </p>
            <div className={styles.welcomeActions}>
              <Button href="/story" variant="secondary" iconRight={<ArrowRight />}>
                Continue Story
              </Button>
              <Link href="/story" className={styles.welcomeGhost}>
                Browse Stories
              </Link>
            </div>
          </motion.section>

          <motion.section className={styles.todayCard} variants={fadeUp}>
            <h3 className={styles.cardLabel}>Today's Reflection</h3>
            <p className={styles.todayPrompt}>
              “What is one small thing that brought you a moment of quiet today?”
            </p>
            <div className={styles.moodRow}>
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  className={`${styles.moodChip} ${moodSaved === m.label ? styles.moodChipActive : ""}`}
                  type="button"
                  onClick={() => checkIn(m)}
                  aria-pressed={moodSaved === m.label}
                >
                  <span
                    className={styles.moodDot}
                    style={{ background: m.color }}
                  />
                  {m.label}
                </button>
              ))}
            </div>
            <span className={styles.todayLink} aria-live="polite">
              {moodSaved
                ? `${moodSaved} check-in saved`
                : "Choose how you feel to update your dashboard"}
            </span>
          </motion.section>
        </div>

        {/* ---- Analytics row ---- */}
        <motion.div
          className={styles.analytics}
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.section
            className={`${styles.panel} ${styles.spanWide}`}
            variants={fadeUp}
          >
            <PanelHead title="Mood Trend" sub="Mood vs calm · this week" />
            <MoodLineChart data={data.moodData} height={230} />
          </motion.section>

          <motion.section className={styles.panel} variants={fadeUp}>
            <PanelHead title="Weekly Activity" sub="Minutes reflected" />
            <ActivityBarChart data={data.activityData} height={230} />
          </motion.section>

          <motion.section className={styles.panel} variants={fadeUp}>
            <PanelHead title="Reflection Mix" sub="Last 30 days" />
            <ReflectionPieChart data={data.mixData} height={200} />
          </motion.section>

          <motion.section
            className={`${styles.panel} ${styles.ringPanel}`}
            variants={fadeUp}
          >
            <PanelHead title="Consistency" sub="Weekly rhythm" />
            <ConsistencyRing value={data.consistency} />
            <p className={styles.ringNote}>
              Active on <strong>{Math.round((data.consistency / 100) * 7)} of 7 days</strong> this week.
            </p>
          </motion.section>
        </motion.div>

        {/* ---- Journey section ---- */}
        <motion.section
          className={styles.journey}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div className={styles.journeyTree}>
            <span className={styles.levelBadge}>Level {level}</span>
            <GrowthTree level={Math.min(4, level)} size={210} />
            <h3 className={styles.treeTitle}>
              {level >= 4 ? "Blooming Grove" : "Growing Sanctuary"}
            </h3>
            <p className={styles.treeSub}>Every completed activity helps it grow.</p>
          </div>

          <div className={styles.journeyStats}>
            <div className={styles.xpHead}>
              <h3 className={styles.cardLabel}>Growth Journey</h3>
              <span className={styles.xpCount}>{data.xp} / {xpTarget} XP</span>
            </div>
            <div className={styles.xpBar}>
              <motion.span
                className={styles.xpFill}
                initial={{ width: 0 }}
                whileInView={{ width: `${xpPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className={styles.xpNote}>{xpTarget - data.xp} XP until your tree blossoms again.</p>

            <div className={styles.statGrid}>
              <div className={styles.statBox}>
                <span className={`${styles.statIcon} ${styles.flame}`}>
                  <Flame size={20} />
                </span>
                <div>
                  <span className={styles.statNum}>
                    {data.streak} {data.streak === 1 ? "day" : "days"}
                  </span>
                  <span className={styles.statLabel}>Current streak</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <span className={`${styles.statIcon} ${styles.trophy}`}>
                  <Trophy size={20} />
                </span>
                <div>
                  <span className={styles.statNum}>
                    {data.completedStories.size + (data.breathingRounds > 0 ? 1 : 0)} of 3
                  </span>
                  <span className={styles.statLabel}>Achievements</span>
                </div>
              </div>
            </div>

            <div className={styles.badges}>
              {[
                { label: "First Reflection", unlocked: data.completedStories.size > 0 },
                { label: "Calm Breath", unlocked: data.breathingRounds > 0 },
                { label: "7-Day Calm", unlocked: data.streak >= 7 },
              ].map((a) => (
                <span
                  key={a.label}
                  className={`${styles.badge} ${
                    a.unlocked ? styles.unlocked : styles.locked
                  }`}
                >
                  {a.unlocked ? <Check size={13} /> : <Trophy size={13} />}
                  {a.label}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ---- Recent stories ---- */}
        <motion.section
          className={styles.stories}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div className={styles.storiesHead}>
            <h3 className={styles.sectionTitle}>Recent Stories</h3>
            <Link href="/story" className={styles.seeAll}>
              View all <ArrowRight size={15} />
            </Link>
          </div>

          {/* featured: story-based emotional check-in */}
          <motion.article
            className={styles.assess}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className={styles.assessGlow} />
            <div className={styles.assessBody}>
              <span className={styles.assessEyebrow}>
                <Sparkle size={15} /> New · Emotional check-in
              </span>
              <h4 className={styles.assessTitle}>One Ordinary Monday</h4>
              <p className={styles.assessText}>
                Live through a single day — the bus, the presentation, a call from
                home. Your choices quietly reveal how you’re really doing, then map
                it into your emotional profile.
              </p>
              <div className={styles.assessMeta}>
                <span className={styles.assessPill}>13 moments</span>
                <span className={styles.assessPill}>~5 min</span>
                <span className={styles.assessPill}>Full report</span>
              </div>
              <div className={styles.assessAction}>
                <Button href="/story/monday" iconRight={<ArrowRight />}>
                  Begin the check-in
                </Button>
              </div>
            </div>
            <div className={styles.assessOrbs} aria-hidden="true">
              <span className={styles.aOrb1} />
              <span className={styles.aOrb2} />
              <span className={styles.aOrb3} />
            </div>
          </motion.article>

          <div className={styles.storyRow}>
            {DASHBOARD_STORIES.map((s) => {
              const done = data.completedStories.has(s.id);
              return (
                <motion.article
                  key={s.id}
                  className={styles.storyCard}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <div
                    className={styles.storyArt}
                    style={{
                      background: `linear-gradient(150deg, ${s.tint}, #ddd6fe)`,
                    }}
                  >
                    <GrowthTree level={done ? 4 : 2} size={120} />
                    <span className={styles.storyStatus}>
                      {done ? "Completed" : "New"}
                    </span>
                  </div>
                  <div className={styles.storyBody}>
                    <h4 className={styles.storyTitle}>{s.title}</h4>
                    <p className={styles.storySub}>{s.subtitle}</p>
                    <div className={styles.storyProgress}>
                      <span
                        className={styles.storyProgressFill}
                        style={{ width: done ? "100%" : "0%" }}
                      />
                    </div>
                    <div className={styles.storyActions}>
                      {done ? (
                        <>
                          <Button href={`${s.href}?view=result`} variant="secondary" size="md">
                            <Eye size={15} /> View Insights
                          </Button>
                          <Link href={s.href} className={styles.ghostAction}>
                            Restart
                          </Link>
                        </>
                      ) : (
                        <Button href={s.href} size="md" iconLeft={<Play size={14} />}>
                          Begin
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* ---- Breathing exercise CTA ---- */}
        <motion.section
          className={styles.breathe}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <div className={styles.breatheGlow} />
          <div className={styles.breatheBody}>
            <span className={styles.breatheEyebrow}>
              <Wind size={15} /> Breathing Exercise
            </span>
            <h3 className={styles.breatheTitle}>
              Feeling anxious or overwhelmed?
            </h3>
            <p className={styles.breatheText}>
              Take a moment in the breathing room. Guided box, 4-7-8, and deep
              breathing to ease sudden panic and release stress.
            </p>
          </div>
          <div className={styles.breatheOrbs} aria-hidden="true">
            <span className={styles.bOrb1} />
            <span className={styles.bOrb2} />
            <span className={styles.bOrb3} />
          </div>
          <div className={styles.breatheAction}>
            <Button href="/breathing" variant="secondary" iconRight={<ArrowRight />}>
              Start breathing
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
}

function PanelHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className={styles.panelHead}>
      <h3 className={styles.cardLabel}>{title}</h3>
      <span className={styles.panelSub}>{sub}</span>
    </div>
  );
}

const MOODS = [
  { label: "Calm", color: "#a78bfa", mood: 78, calm: 90 },
  { label: "Hopeful", color: "#c4b5fd", mood: 88, calm: 76 },
  { label: "Tender", color: "#ecd9c4", mood: 68, calm: 72 },
  { label: "Restless", color: "#c8c2d2", mood: 48, calm: 36 },
];

const DASHBOARD_STORIES = [
  {
    id: "silent-lake" as const,
    title: "The Silent Lake",
    subtitle: "On stillness & rest",
    tint: "#a78bfa",
    href: "/story",
  },
  {
    id: "ordinary-monday" as const,
    title: "One Ordinary Monday",
    subtitle: "An emotional check-in",
    tint: "#c4b5fd",
    href: "/story/monday",
  },
];
