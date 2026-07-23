"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import DaySceneArt from "@/components/story/DaySceneArt";
import AssessmentReport from "@/components/story/AssessmentReport";
import ParticleField from "@/components/illustrations/ParticleField";
import { Close } from "@/components/ui/Icons";
import { ASSESSMENT, type AChoice } from "@/lib/assessmentData";
import styles from "../page.module.css";

type Phase = "story" | "echo" | "summary";

export default function AssessmentPage() {
  const sceneMap = useMemo(
    () => Object.fromEntries(ASSESSMENT.scenes.map((s) => [s.id, s])),
    []
  );

  const [currentId, setCurrentId] = useState(ASSESSMENT.start);
  const [picks, setPicks] = useState<AChoice[]>([]);
  const [phase, setPhase] = useState<Phase>("story");
  const [echo, setEcho] = useState("");

  const current = sceneMap[currentId];
  const busy = useRef(false);

  const choose = useCallback(
    (choice: AChoice) => {
      if (busy.current) return;
      busy.current = true;

      setPicks((p) => [...p, choice]);
      setEcho(choice.echo);
      setPhase("echo");

      window.setTimeout(() => {
        if (choice.next === "END") {
          setPhase("summary");
        } else {
          setCurrentId(choice.next);
          setPhase("story");
        }
        busy.current = false;
      }, 1900);
    },
    []
  );

  const restart = useCallback(() => {
    busy.current = false;
    setCurrentId(ASSESSMENT.start);
    setPicks([]);
    setEcho("");
    setPhase("story");
  }, []);

  if (phase === "summary" || !current) {
    return <AssessmentReport picks={picks} onRestart={restart} />;
  }

  const step = picks.length + (phase === "echo" ? 1 : 0);
  const progress = Math.min(100, (step / ASSESSMENT.total) * 100);

  return (
    <main className={styles.page}>
      <ParticleField count={30} className={styles.particles} />

      <header className={styles.bar}>
        <Logo />
        <div className={styles.progressWrap} aria-hidden="true">
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
        <Link href="/story" className={styles.exit} aria-label="Choose another story">
          <Close size={20} />
        </Link>
      </header>

      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className={styles.scene}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.art}>
              <DaySceneArt scene={current.scene} />
            </div>

            <div className={styles.copy}>
              <AnimatePresence mode="wait">
                {phase === "echo" ? (
                  <motion.div
                    key="echo"
                    className={styles.echo}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.echoMark} />
                    <p className={styles.echoText}>{echo}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="story"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.chapter}>{current.chapter}</span>
                    <h1 className={styles.title}>{current.title}</h1>
                    <p className={styles.paragraph}>{current.paragraph}</p>
                    <p className={styles.question}>{current.question}</p>

                    <div className={styles.choices}>
                      {current.choices.map((c, i) => (
                        <motion.button
                          key={c.id}
                          className={styles.choice}
                          onClick={() => choose(c)}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.25 + i * 0.1,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{ x: 6 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={styles.choiceGlyph}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className={styles.choiceLabel}>{c.label}</span>
                          <span className={styles.choiceArrow}>→</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
