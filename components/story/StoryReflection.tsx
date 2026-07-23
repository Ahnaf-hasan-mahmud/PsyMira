"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import EmotionWheel from "./EmotionWheel";
import ParticleField from "@/components/illustrations/ParticleField";
import GrowthTree from "@/components/illustrations/GrowthTree";
import { ArrowRight, Sparkle } from "@/components/ui/Icons";
import { tally, EMOTION_META, STORY, type Choice } from "@/lib/storyData";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "./StoryReflection.module.css";
import { recordActivity } from "@/lib/activityStore";

/**
 * Completion view. Mirrors the patterns from the choices back as
 * gentle, strengths-first reflections — never scores or diagnoses.
 */
export default function StoryReflection({
  picks,
  onRestart,
}: {
  picks: Choice[];
  onRestart: () => void;
}) {
  const totals = tally(picks);
  const top = totals.filter((t) => t.value > 0).slice(0, 3);
  const lead = top[0];

  // Persist the completed reflection once (no-op until Supabase is configured).
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || picks.length === 0) return;
    savedRef.current = true;

    recordActivity({
      kind: "story",
      storyId: "silent-lake",
      title: STORY.title,
      minutes: 5,
      mood: 72,
      calm: Math.min(100, 62 + (totals.find((t) => t.emotion === "stillness")?.value ?? 0) * 4),
      emotion: lead ? EMOTION_META[lead.emotion].label : "Reflective",
    });

    const supabase = createClient();
    if (!supabase) return;

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const emotions = Object.fromEntries(totals.map((t) => [t.emotion, t.value]));
      await supabase.from("reflections").insert({
        user_id: user.id,
        story_id: "silent-lake",
        story_title: STORY.title,
        lead_emotion: lead?.emotion ?? null,
        emotions,
      });
    })();
  }, [picks, totals, lead]);

  return (
    <main className={styles.page}>
      <ParticleField count={40} className={styles.particles} />
      <div className={styles.glow} />

      <motion.header
        className={styles.bar}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo />
      </motion.header>

      <motion.div
        className={styles.inner}
        variants={stagger(0.12)}
        initial="hidden"
        animate="show"
      >
        <motion.div className={styles.intro} variants={fadeUp}>
          <span className={styles.eyebrow}>
            <Sparkle size={15} /> Reflection complete
          </span>
          <h1 className={styles.title}>
            What the <span className="gradient-text">silent lake</span> showed
            you
          </h1>
          <p className={styles.lede}>
            There are no right answers here — only patterns. Here's the shape of
            what moved through you on this walk.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {/* emotion wheel */}
          <motion.section
            className={`${styles.card} ${styles.wheelCard}`}
            variants={fadeUp}
          >
            <h2 className={styles.cardTitle}>Your Emotion Wheel</h2>
            <EmotionWheel data={totals} size={280} />
            {lead && (
              <p className={styles.wheelNote}>
                Today, <strong>{EMOTION_META[lead.emotion].label}</strong> led
                the way.
              </p>
            )}
          </motion.section>

          {/* insights */}
          <motion.section className={styles.insights} variants={fadeUp}>
            <h2 className={styles.cardTitle}>Small insights</h2>
            <div className={styles.insightList}>
              {top.map((t, i) => {
                const meta = EMOTION_META[t.emotion];
                return (
                  <motion.div
                    key={t.emotion}
                    className={styles.insight}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.12 }}
                  >
                    <span
                      className={styles.insightDot}
                      style={{ background: meta.color }}
                    />
                    <div>
                      <span className={styles.insightLabel}>{meta.label}</span>
                      <p className={styles.insightLine}>{meta.line}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className={styles.growth}>
              <GrowthTree level={4} size={96} />
              <div>
                <span className={styles.growthTitle}>Your tree grew</span>
                <p className={styles.growthBody}>
                  This reflection added a new branch to your sanctuary. Come
                  back tomorrow to watch it bloom further.
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* closing summary */}
        <motion.section className={styles.summary} variants={fadeUp}>
          <p className={styles.summaryText}>
            “You move through uncertainty with a quiet, steady grace — pausing
            when you need stillness, and stepping forward when something gentle
            in you is ready.”
          </p>
        </motion.section>

        <motion.div className={styles.actions} variants={fadeUp}>
          <Button href="/dashboard" size="lg" iconRight={<ArrowRight />}>
            Return to Sanctuary
          </Button>
          <button className={styles.restart} onClick={onRestart}>
            Walk it again
          </button>
        </motion.div>

        <motion.p className={styles.disclaimer} variants={fadeUp}>
          PsyMira reflects patterns to help you understand yourself. It is not a
          diagnosis or a substitute for professional care.
        </motion.p>
      </motion.div>
    </main>
  );
}
