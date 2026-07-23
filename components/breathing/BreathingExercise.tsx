"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useAnimationControls,
} from "framer-motion";
import ParticleField from "@/components/illustrations/ParticleField";
import { Wind, Play, Pause, Stop, Restart } from "@/components/ui/Icons";
import { TECHNIQUES, type Technique } from "@/lib/breathingData";
import { easeOut } from "@/lib/motion";
import { recordActivity } from "@/lib/activityStore";
import styles from "./BreathingExercise.module.css";

export default function BreathingExercise({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  const [techId, setTechId] = useState<Technique["id"]>("box");
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  const tech = TECHNIQUES.find((t) => t.id === techId)!;
  const phase = tech.phases[phaseIndex];

  const orb = useAnimationControls();
  const ring = useAnimationControls();

  // Seed the countdown whenever we land on a fresh technique / first phase.
  useEffect(() => {
    setSecondsLeft(tech.phases[0].seconds);
  }, [techId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- The heartbeat: drives the current phase while running. -----------
  useEffect(() => {
    if (!running) {
      orb.stop();
      ring.stop();
      return;
    }

    const p = tech.phases[phaseIndex];
    setSecondsLeft(p.seconds);

    // Orb expands on inhale / holds size on hold / contracts on exhale.
    orb.start({
      scale: p.scale,
      transition: { duration: p.seconds, ease: easeOut },
    });
    // Progress ring sweeps once across the phase.
    ring.set({ pathLength: 0 });
    ring.start({
      pathLength: 1,
      transition: { duration: p.seconds, ease: "linear" },
    });

    // Visible per-second countdown.
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => (s > 1 ? s - 1 : s));
    }, 1000);

    // Advance to the next phase when this one completes.
    const advance = window.setTimeout(() => {
      setPhaseIndex((i) => {
        const next = (i + 1) % tech.phases.length;
        if (next === 0) {
          setCycles((c) => c + 1);
          const seconds = tech.phases.reduce((sum, item) => sum + item.seconds, 0);
          recordActivity({
            kind: "breathing",
            minutes: seconds / 60,
            mood: 74,
            calm: 88,
            emotion: "Calm",
            technique: tech.name,
            title: `${tech.name} breathing`,
          });
        }
        return next;
      });
    }, p.seconds * 1000);

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(advance);
    };
  }, [running, phaseIndex, techId]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = useCallback(
    (nextId: Technique["id"] = techId) => {
      const next = TECHNIQUES.find((t) => t.id === nextId)!;
      setRunning(false);
      setStarted(false);
      setPhaseIndex(0);
      setCycles(0);
      setSecondsLeft(next.phases[0].seconds);
      orb.start({ scale: 1, transition: { duration: 0.6, ease: easeOut } });
      ring.set({ pathLength: 0 });
    },
    [techId, orb, ring]
  );

  const pickTechnique = useCallback(
    (id: Technique["id"]) => {
      if (id === techId) return;
      setTechId(id);
      reset(id);
    },
    [techId, reset]
  );

  const toggle = useCallback(() => {
    setStarted(true);
    setRunning((r) => !r);
  }, []);

  const stop = useCallback(() => reset(), [reset]);

  return (
    <motion.section
      className={styles.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
      }}
    >
      {/* header */}
      {!hideHeader && (
        <div className={styles.head}>
          <div>
            <span className={styles.eyebrow}>
              <Wind size={15} /> Breathing Exercise
            </span>
            <h3 className={styles.title}>Find your calm in a few breaths</h3>
            <p className={styles.sub}>
              A guided space to slow a racing mind, ease sudden panic, and let
              stress drain away. Pick a rhythm and follow the orb.
            </p>
          </div>
        </div>
      )}

      {/* technique chips */}
      <div className={styles.tabs} role="tablist" aria-label="Breathing techniques">
        {TECHNIQUES.map((t) => {
          const active = t.id === techId;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              className={`${styles.tab} ${active ? styles.tabActive : ""}`}
              onClick={() => pickTechnique(t.id)}
              style={
                active
                  ? ({
                      "--chip": t.color,
                      "--chip-soft": t.colorSoft,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              {active && (
                <motion.span
                  layoutId="breath-tab-pill"
                  className={styles.tabPill}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                />
              )}
              <span className={styles.tabName}>{t.name}</span>
              <span className={styles.tabRhythm}>{t.rhythm}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.body}>
        {/* ---- the living orb ---- */}
        <div
          className={styles.stage}
          style={
            {
              "--orb": tech.color,
              "--orb-soft": tech.colorSoft,
            } as React.CSSProperties
          }
        >
          <ParticleField count={26} className={styles.particles} />

          {/* soft outer auras that breathe with the orb */}
          <motion.div className={styles.aura} animate={orb} />
          <motion.div
            className={styles.auraFaint}
            animate={running ? { scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] } : { scale: 1, opacity: 0.5 }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* progress ring */}
          <svg className={styles.ring} viewBox="0 0 220 220" aria-hidden="true">
            <circle
              className={styles.ringTrack}
              cx="110"
              cy="110"
              r="101"
            />
            <motion.circle
              className={styles.ringFill}
              cx="110"
              cy="110"
              r="101"
              animate={ring}
              initial={{ pathLength: 0 }}
              transform="rotate(-90 110 110)"
            />
          </svg>

          {/* the breathing orb */}
          <motion.div className={styles.orb} animate={orb} initial={{ scale: 1 }}>
            <div className={styles.orbGlow} />
            <div className={styles.orbCore}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={running ? phase.kind + phaseIndex : "idle"}
                  className={styles.phaseLabel}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                >
                  {running ? phase.label : "Ready"}
                </motion.span>
              </AnimatePresence>
              <span className={styles.count}>
                {running ? secondsLeft : tech.phases[0].seconds}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ---- side panel: purpose + controls + progress ---- */}
        <div className={styles.panel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: easeOut }}
            >
              <span className={styles.panelTag} style={{ color: tech.color }}>
                {tech.tag}
              </span>
              <p className={styles.purpose}>{tech.purpose}</p>
            </motion.div>
          </AnimatePresence>

          <div className={styles.rhythmRow}>
            {tech.phases.map((p, i) => (
              <div
                key={i}
                className={`${styles.beat} ${
                  running && i === phaseIndex ? styles.beatOn : ""
                }`}
                style={{ "--orb": tech.color } as React.CSSProperties}
              >
                <span className={styles.beatKind}>{p.label}</span>
                <span className={styles.beatSec}>{p.seconds}s</span>
              </div>
            ))}
          </div>

          <div className={styles.controls}>
            <button
              className={styles.play}
              onClick={toggle}
              style={{ background: tech.color }}
            >
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? "Pause" : cycles > 0 ? "Resume" : "Begin"}
            </button>
            <button
              className={styles.stopBtn}
              onClick={stop}
              disabled={!started}
              aria-label="Stop breathing exercise"
            >
              <Stop size={16} /> Stop
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => reset()}
              aria-label="Reset"
            >
              <Restart size={18} />
            </button>
          </div>

          <div className={styles.cycleRow}>
            <span className={styles.cycleDot} style={{ background: tech.color }} />
            {cycles === 0
              ? "Take it slow — even one round helps."
              : `${cycles} calm ${cycles === 1 ? "round" : "rounds"} completed`}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
