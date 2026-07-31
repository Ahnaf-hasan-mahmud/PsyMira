"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import ParticleField from "@/components/illustrations/ParticleField";
import TraitRadar from "@/components/charts/TraitRadar";
import { ArrowRight, Sparkle, Check, Wind } from "@/components/ui/Icons";
import {
  categorize,
  radarData,
  TRAIT_META,
  type AChoice,
  type Trait,
} from "@/lib/assessmentData";
import { HOMECOMING_ASSESSMENT, buildHomecomingReport } from "@/lib/homecomingData";
import { fadeUp, stagger, easeOut } from "@/lib/motion";
import styles from "./AssessmentReport.module.css";
import { recordActivity } from "@/lib/activityStore";

export default function HomecomingReport({
  picks,
  onRestart,
}: {
  picks: AChoice[];
  onRestart: () => void;
}) {
  const report = useMemo(() => buildHomecomingReport(picks), [picks]);
  const radar = useMemo(() => radarData(report.totals), [report.totals]);
  const { score, band } = report.wellness;

  // wellness gauge geometry
  const size = 190;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  // Persist once
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current || picks.length === 0) return;
    saved.current = true;
    recordActivity({
      kind: "story",
      storyId: "homecoming",
      title: HOMECOMING_ASSESSMENT.title,
      minutes: 5,
      mood: score,
      calm: Math.round((score + 65) / 2),
      emotion: report.profile.name,
    });
    const supabase = createClient();
    if (!supabase) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("reflections").insert({
        user_id: user.id,
        story_id: HOMECOMING_ASSESSMENT.id,
        story_title: HOMECOMING_ASSESSMENT.title,
        lead_emotion: report.profile.name,
        emotions: { ...report.totals, wellness: score },
      });
    })();
  }, [picks, report, score]);

  return (
    <main className={styles.page}>
      <ParticleField count={38} className={styles.particles} />
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
        variants={stagger(0.1)}
        initial="hidden"
        animate="show"
      >
        {/* ---- intro + profile ---- */}
        <motion.div className={styles.intro} variants={fadeUp}>
          <span className={styles.eyebrow}>
            <Sparkle size={15} /> Your reflection is ready
          </span>
          <h1 className={styles.title}>
            You are <span className="gradient-text">{report.profile.name}</span>
          </h1>
          <p className={styles.lede}>{report.profile.blurb}</p>
        </motion.div>

        {/* ---- top row: wellness + radar ---- */}
        <div className={styles.topGrid}>
          <motion.section className={`${styles.card} ${styles.gaugeCard}`} variants={fadeUp}>
            <h2 className={styles.cardTitle}>Overall Wellness</h2>
            <div className={styles.gaugeWrap} style={{ width: size, height: size }}>
              <svg width={size} height={size}>
                <defs>
                  <linearGradient id="wellGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#c4b5fd" />
                    <stop offset="100%" stopColor="#8b6df0" />
                  </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ece6f5" strokeWidth={stroke} />
                <motion.circle
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke="url(#wellGrad)"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={c}
                  initial={{ strokeDashoffset: c }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.5, ease: easeOut }}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </svg>
              <div className={styles.gaugeCenter}>
                <span className={styles.gaugeNum}>{score}</span>
                <span className={styles.gaugeOf}>/ 100</span>
              </div>
            </div>
            <span className={styles.band}>{band}</span>
          </motion.section>

          <motion.section className={`${styles.card} ${styles.radarCard}`} variants={fadeUp}>
            <h2 className={styles.cardTitle}>Your Emotional Map</h2>
            <TraitRadar data={radar} height={300} />
            <p className={styles.radarNote}>
              Eleven quiet patterns, mapped from the choices you made across your journey home.
            </p>
          </motion.section>
        </div>

        {/* ---- status grid ---- */}
        <motion.section className={styles.card} variants={fadeUp}>
          <h2 className={styles.cardTitle}>Trait by Trait</h2>
          <div className={styles.statusGrid}>
            {(Object.keys(TRAIT_META) as Trait[]).map((t) => {
              const cat = categorize(t, report.totals[t]);
              return (
                <div key={t} className={styles.statusChip}>
                  <div className={styles.statusHead}>
                    <span className={styles.statusName}>{TRAIT_META[t].full}</span>
                    <span className={`${styles.statusBadge} ${styles[cat.tone]}`}>
                      {cat.label}
                    </span>
                  </div>
                  <div className={styles.statusTrack}>
                    <motion.span
                      className={`${styles.statusFill} ${styles[cat.tone]}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (Math.max(0, report.totals[t]) / 12) * 100)}%` }}
                      transition={{ duration: 1, ease: easeOut }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className={styles.legend}>
            <span className={`${styles.dot} ${styles.flourishing}`} /> Flourishing
            <span className={`${styles.dot} ${styles.mild}`} /> Mild
            <span className={`${styles.dot} ${styles.moderate}`} /> Moderate
            <span className={`${styles.dot} ${styles.high}`} /> High
            <span className={`${styles.dot} ${styles.veryhigh}`} /> Very High
          </p>
        </motion.section>

        {/* ---- strengths + areas ---- */}
        <div className={styles.twoCol}>
          <motion.section className={`${styles.card} ${styles.strengthCard}`} variants={fadeUp}>
            <h2 className={styles.cardTitle}>Your Strengths</h2>
            <div className={styles.list}>
              {report.strengths.map((s) => (
                <div key={s.trait} className={styles.item}>
                  <span className={styles.tick}><Check size={13} /></span>
                  <div>
                    <span className={styles.itemLabel}>{TRAIT_META[s.trait].full}</span>
                    <p className={styles.itemLine}>{s.line}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className={`${styles.card} ${styles.areaCard}`} variants={fadeUp}>
            <h2 className={styles.cardTitle}>Gentle Focus Areas</h2>
            <div className={styles.list}>
              {report.areas.map((a) => (
                <div key={a.trait} className={styles.item}>
                  <span className={styles.arrowDot}><ArrowRight size={13} /></span>
                  <div>
                    <span className={styles.itemLabel}>{TRAIT_META[a.trait].full}</span>
                    <p className={styles.itemLine}>{a.line}</p>
                    <p className={styles.rec}>{a.rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* ---- daily habits ---- */}
        <motion.section className={`${styles.card} ${styles.habitCard}`} variants={fadeUp}>
          <h2 className={styles.cardTitle}>Small Daily Habits</h2>
          <div className={styles.habits}>
            {report.habits.map((h, i) => (
              <div key={i} className={styles.habit}>
                <span className={styles.habitNum}>{i + 1}</span>
                {h}
              </div>
            ))}
          </div>
          <Link href="/breathing" className={styles.breatheLink}>
            <Wind size={16} /> Try a guided breathing exercise
            <ArrowRight size={15} />
          </Link>
        </motion.section>

        {/* ---- encouraging summary ---- */}
        <motion.section className={styles.summary} variants={fadeUp}>
          <p className={styles.summaryText}>{report.summary}</p>
        </motion.section>

        <motion.div className={styles.actions} variants={fadeUp}>
          <Button href="/dashboard" size="lg" iconRight={<ArrowRight />}>
            Return to Sanctuary
          </Button>
          <button className={styles.restart} onClick={onRestart}>
            Live the story again
          </button>
        </motion.div>

        <motion.p className={styles.disclaimer} variants={fadeUp}>
          This is an emotional wellness reflection, not a clinical diagnosis. It's meant to
          help you notice patterns, not to label or assess you medically. If you're
          struggling, please reach out to a qualified mental-health professional or a local
          support line.
        </motion.p>
      </motion.div>
    </main>
  );
}
