"use client";

/* ============================================================
   RelaxationCard — one soundscape: gradient thumbnail, title,
   description, favorite heart, and the AudioPlayer transport.
   ============================================================ */

import { motion } from "framer-motion";
import { Heart, Headphones } from "@/components/ui/Icons";
import type { Soundscape } from "@/lib/relaxationData";
import { fadeUp } from "@/lib/motion";
import AudioPlayer from "./AudioPlayer";
import styles from "./RelaxationCard.module.css";

type Props = {
  track: Soundscape;
  active: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  favorite: boolean;
  onToggle: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolume: (value: number) => void;
  onFavorite: () => void;
};

export default function RelaxationCard({
  track,
  active,
  playing,
  currentTime,
  duration,
  volume,
  favorite,
  onToggle,
  onStop,
  onSeek,
  onVolume,
  onFavorite,
}: Props) {
  const live = active && playing;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`${styles.card} ${active ? styles.cardActive : ""}`}
      style={{ ["--accent" as string]: track.accent }}
      aria-label={`${track.title} soundscape`}
    >
      {/* thumbnail */}
      <div
        className={styles.thumb}
        style={{ backgroundImage: track.gradient }}
      >
        <motion.span
          className={styles.emoji}
          aria-hidden="true"
          animate={
            live
              ? { scale: [1, 1.12, 1], rotate: [0, 3, -3, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{
            duration: 5,
            repeat: live ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {track.emoji}
        </motion.span>

        {live && (
          <span className={styles.equalizer} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        )}

        <button
          type="button"
          className={`${styles.heart} ${favorite ? styles.heartOn : ""}`}
          onClick={onFavorite}
          aria-label={
            favorite
              ? `Remove ${track.title} from favorites`
              : `Add ${track.title} to favorites`
          }
          aria-pressed={favorite}
        >
          <Heart size={18} filled={favorite} />
        </button>
      </div>

      {/* body */}
      <div className={styles.body}>
        <header className={styles.head}>
          <h3 className={styles.title}>{track.title}</h3>
          {live && (
            <span className={styles.nowPlaying}>
              <Headphones size={14} /> Playing
            </span>
          )}
        </header>
        <p className={styles.desc}>{track.description}</p>

        <AudioPlayer
          title={track.title}
          accent={track.accent}
          active={active}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          onToggle={onToggle}
          onStop={onStop}
          onSeek={onSeek}
          onVolume={onVolume}
        />
      </div>
    </motion.article>
  );
}
