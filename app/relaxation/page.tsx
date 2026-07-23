"use client";

/* ============================================================
   PsyMira — Relaxation
   Ambient soundscapes to lower stress, sharpen focus and ease
   into rest. One shared audio element means only one track ever
   plays at a time. Favorites persist to localStorage; a sleep
   timer fades playback out gently.
   ============================================================ */

import { useMemo } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/dashboard/TopNav";
import RelaxationCard from "@/components/relaxation/RelaxationCard";
import Timer from "@/components/relaxation/Timer";
import { Waves, Headphones, Heart } from "@/components/ui/Icons";
import { SOUNDSCAPES, RECOMMENDED } from "@/lib/relaxationData";
import { useRelaxationPlayer } from "@/lib/useRelaxationPlayer";
import { useFavorites } from "@/lib/relaxationStore";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "./page.module.css";

export default function RelaxationPage() {
  const player = useRelaxationPlayer(SOUNDSCAPES);
  const { isFavorite, toggleFavorite, favorites } = useFavorites();

  const recommended = useMemo(
    () => SOUNDSCAPES.find((t) => t.id === RECOMMENDED.id)!,
    []
  );

  return (
    <>
      <TopNav name="Aria" />

      <motion.main
        className={styles.page}
        variants={stagger(0.08)}
        initial="hidden"
        animate="show"
      >
        {/* header */}
        <motion.header className={styles.hero} variants={fadeUp}>
          <span className={styles.eyebrow}>
            <Waves size={16} /> Relaxation
          </span>
          <h1 className={styles.title}>Relaxation Sounds</h1>
          <p className={styles.lede}>
            Take a moment for yourself. Choose a peaceful soundscape and relax.
          </p>
          <p className={styles.headphones}>
            <Headphones size={15} /> For the best experience, use headphones.
          </p>
        </motion.header>

        {/* recommended today */}
        <motion.section
          className={styles.recommend}
          variants={fadeUp}
          style={{ ["--accent" as string]: recommended.accent }}
          aria-label="Recommended today"
        >
          <div
            className={styles.recommendGlow}
            style={{ backgroundImage: recommended.gradient }}
            aria-hidden="true"
          />
          <div className={styles.recommendInner}>
            <span className={styles.recommendLabel}>Recommended Today</span>
            <div className={styles.recommendBody}>
              <span className={styles.recommendEmoji} aria-hidden="true">
                {recommended.emoji}
              </span>
              <div>
                <h2 className={styles.recommendTitle}>{recommended.title}</h2>
                <p className={styles.recommendText}>{RECOMMENDED.reason}</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* sleep timer */}
        <Timer
          active={player.timerMinutes}
          remaining={player.remaining}
          fading={player.isFading}
          onSelect={player.setTimer}
        />

        {/* soundscapes grid */}
        <motion.section
          className={styles.gridWrap}
          variants={fadeUp}
          aria-label="Soundscapes"
        >
          <div className={styles.gridHead}>
            <h2 className={styles.gridTitle}>Soundscapes</h2>
            {favorites.length > 0 && (
              <span className={styles.favCount}>
                <Heart size={14} filled /> {favorites.length} favorite
                {favorites.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className={styles.grid}>
            {SOUNDSCAPES.map((track) => {
              const active = player.activeId === track.id;
              return (
                <RelaxationCard
                  key={track.id}
                  track={track}
                  active={active}
                  playing={player.isPlaying}
                  currentTime={player.currentTime}
                  duration={player.duration}
                  volume={player.volumes[track.id] ?? 0.7}
                  favorite={isFavorite(track.id)}
                  onToggle={() => player.toggle(track)}
                  onStop={player.stop}
                  onSeek={(time) => player.seek(track.id, time)}
                  onVolume={(value) => player.setVolume(track.id, value)}
                  onFavorite={() => toggleFavorite(track.id)}
                />
              );
            })}
          </div>
        </motion.section>

        <p className={styles.disclaimer}>
          Ambient sound is a gentle aid for relaxation and focus — not a
          substitute for professional care. If stress or sleeplessness feels
          overwhelming, please reach out to a mental-health professional.
        </p>
      </motion.main>
    </>
  );
}
