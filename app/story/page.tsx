"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import SceneArt from "@/components/story/SceneArt";
import StoryReflection from "@/components/story/StoryReflection";
import ParticleField from "@/components/illustrations/ParticleField";
import { ArrowRight, Close } from "@/components/ui/Icons";
import { STORY, type Choice } from "@/lib/storyData";
import styles from "./page.module.css";

type Phase = "story" | "echo" | "summary";

export default function StoryPage() {
  const [view, setView] = useState<"library" | "story">("library");
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<Choice[]>([]);
  const [phase, setPhase] = useState<Phase>("story");
  const [echo, setEcho] = useState("");

  const total = STORY.scenes.length;
  const current = STORY.scenes[index];

  // Guards against advancing twice if interactions outpace re-renders:
  // the decision to advance always reads the *live* index, never a stale closure.
  const indexRef = useRef(0);
  indexRef.current = index;
  const busyRef = useRef(false);

  const choose = useCallback(
    (choice: Choice) => {
      if (busyRef.current) return;
      busyRef.current = true;

      setPicks((p) => [...p, choice]);
      setEcho(choice.echo);
      setPhase("echo");

      // let the echo breathe, then advance to the next scene (or summary)
      window.setTimeout(() => {
        const atLast = indexRef.current + 1 >= total;
        if (atLast) {
          setPhase("summary");
        } else {
          setIndex((i) => i + 1);
          setPhase("story");
        }
        busyRef.current = false;
      }, 1900);
    },
    [total]
  );

  const restart = useCallback(() => {
    busyRef.current = false;
    indexRef.current = 0;
    setIndex(0);
    setPicks([]);
    setEcho("");
    setPhase("story");
  }, []);

  const openStory = useCallback(() => {
    restart();
    setView("story");
  }, [restart]);

  if (view === "library") {
    return (
      <main className={`${styles.page} ${styles.libraryPage}`}>
        <ParticleField count={34} className={styles.particles} />

        <header className={styles.libraryBar}>
          <Logo />
          <Link
            href="/dashboard"
            className={styles.exit}
            aria-label="Back to dashboard"
          >
            <Close size={20} />
          </Link>
        </header>

        <section className={styles.library} aria-labelledby="story-library-title">
          <motion.div
            className={styles.libraryIntro}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.chapter}>Choose your journey</span>
            <h1 id="story-library-title" className={styles.libraryTitle}>
              What story feels right today?
            </h1>
            <p className={styles.libraryCopy}>
              Take a quiet moment and choose the reflection you would like to explore.
            </p>
          </motion.div>

          <div className={styles.storyGrid}>
            <motion.button
              type="button"
              className={styles.storyCard}
              onClick={openStory}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -7 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={`${styles.cardArt} ${styles.lakeArt}`} aria-hidden="true">
                <span className={styles.moon} />
                <span className={styles.horizon} />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardEyebrow}>Reflective story · 5 chapters</span>
                <strong className={styles.cardTitle}>{STORY.title}</strong>
                <span className={styles.cardText}>
                  A gentle journey through stillness, courage, connection, and wonder.
                </span>
                <span className={styles.cardAction}>Begin story <ArrowRight size={17} /></span>
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -7 }}
            >
              <Link href="/story/monday" className={styles.storyCard}>
                <span className={`${styles.cardArt} ${styles.mondayArt}`} aria-hidden="true">
                  <span className={styles.sun} />
                  <span className={styles.window} />
                </span>
                <span className={styles.cardBody}>
                  <span className={styles.cardEyebrow}>Emotional check-in · 13 moments</span>
                  <strong className={styles.cardTitle}>One Ordinary Monday</strong>
                  <span className={styles.cardText}>
                    Move through an ordinary day and gently notice what your choices reveal.
                  </span>
                  <span className={styles.cardAction}>Begin check-in <ArrowRight size={17} /></span>
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    );
  }

  // `!current` is a safety net — if the index ever overruns, show the summary.
  if (phase === "summary" || !current) {
    return <StoryReflection picks={picks} onRestart={restart} />;
  }

  const progress = ((index + (phase === "echo" ? 1 : 0)) / total) * 100;

  return (
    <main className={styles.page}>
      <ParticleField count={34} className={styles.particles} />

      {/* top bar: progress + exit */}
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
          <div className={styles.dots}>
            {STORY.scenes.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i <= index ? styles.dotOn : ""}`}
              />
            ))}
          </div>
        </div>
        <button
          type="button"
          className={styles.exit}
          aria-label="Choose another story"
          onClick={() => setView("library")}
        >
          <Close size={20} />
        </button>
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
            {/* illustration */}
            <div className={styles.art}>
              <SceneArt scene={current.scene} />
            </div>

            {/* narrative */}
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
                    <span className={styles.chapter}>
                      Chapter {index + 1}
                    </span>
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
                            delay: 0.25 + i * 0.12,
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
