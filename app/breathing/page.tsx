"use client";

import { motion } from "framer-motion";
import BreathingExercise from "@/components/breathing/BreathingExercise";
import { Wind } from "@/components/ui/Icons";
import { TECHNIQUES } from "@/lib/breathingData";
import { fadeUp, stagger, viewportOnce, easeOut } from "@/lib/motion";
import styles from "./page.module.css";

export default function BreathingPage() {
  return (
    <>
      {/* ---- hero header ---- */}
      <motion.header
        className={styles.hero}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
      >
        <div className={styles.heroGlow} />
        <span className={styles.eyebrow}>
          <Wind size={15} /> Breathing Exercise
        </span>
        <h1 className={styles.heroTitle}>
          Breathe through the moment.
        </h1>
        <p className={styles.heroBody}>
          When stress builds or panic strikes, your breath is the fastest way
          back to calm. Choose a guided rhythm below, follow the orb, and let
          your nervous system settle. A few minutes is all it takes.
        </p>
        <div className={styles.heroMeta}>
          <span className={styles.metaPill}>3 guided techniques</span>
          <span className={styles.metaPill}>No account needed</span>
          <span className={styles.metaPill}>Works on any device</span>
        </div>
      </motion.header>

      {/* ---- the interactive player ---- */}
      <section className={styles.playerBlock}>
        <BreathingExercise hideHeader />
      </section>

      {/* ---- detailed technique guides ---- */}
      <motion.section
        className={styles.guides}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <div className={styles.guidesHead}>
          <h2 className={styles.guidesTitle}>Which one do you need?</h2>
          <p className={styles.guidesSub}>
            Each technique calms you in a slightly different way. Read through
            and pick the one that matches how you feel right now.
          </p>
        </div>

        <div className={styles.guideGrid}>
          {TECHNIQUES.map((t) => (
            <motion.article
              key={t.id}
              className={styles.guide}
              variants={fadeUp}
              style={
                {
                  "--gc": t.color,
                  "--gc-soft": t.colorSoft,
                } as React.CSSProperties
              }
            >
              <div className={styles.guideTop}>
                <span className={styles.guideDot} />
                <div>
                  <h3 className={styles.guideName}>{t.name}</h3>
                  <span className={styles.guideRhythm}>{t.rhythm}</span>
                </div>
              </div>

              <p className={styles.guideAbout}>{t.short}</p>

              <div className={styles.whenRow}>
                <span className={styles.whenTag}>Best when</span>
                <span className={styles.whenText}>{t.whenShort}</span>
              </div>
            </motion.article>
          ))}
        </div>

        <p className={styles.disclaimer}>
          Breathing exercises are a supportive tool, not a substitute for
          professional care. If panic attacks are frequent or severe, please
          reach out to a mental-health professional or a crisis line in your
          area.
        </p>
      </motion.section>
    </>
  );
}
