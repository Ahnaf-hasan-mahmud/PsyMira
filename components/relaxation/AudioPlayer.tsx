"use client";

/* ============================================================
   AudioPlayer — presentational transport for one soundscape.
   All audio state lives in the shared useRelaxationPlayer hook;
   this component only renders controls and reports intent.
   ============================================================ */

import { motion } from "framer-motion";
import { Play, Pause, Stop, Volume, VolumeMute } from "@/components/ui/Icons";
import styles from "./AudioPlayer.module.css";

function fmt(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Props = {
  title: string;
  accent: string;
  active: boolean;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onToggle: () => void;
  onStop: () => void;
  onSeek: (time: number) => void;
  onVolume: (value: number) => void;
};

export default function AudioPlayer({
  title,
  accent,
  active,
  playing,
  currentTime,
  duration,
  volume,
  onToggle,
  onStop,
  onSeek,
  onVolume,
}: Props) {
  const time = active ? currentTime : 0;
  const total = active ? duration : 0;
  const pct = total ? Math.min(100, (time / total) * 100) : 0;

  return (
    <div className={styles.player} style={{ ["--accent" as string]: accent }}>
      {/* progress */}
      <div className={styles.progressRow}>
        <span className={styles.time} aria-hidden="true">
          {fmt(time)}
        </span>
        <input
          type="range"
          className={styles.progress}
          min={0}
          max={total || 1}
          step={0.1}
          value={time}
          disabled={!active || !total}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label={`Seek within ${title}`}
          aria-valuetext={`${fmt(time)} of ${fmt(total)}`}
          style={{ ["--pct" as string]: `${pct}%` }}
        />
        <span className={styles.time} aria-hidden="true">
          {fmt(total)}
        </span>
      </div>

      {/* transport */}
      <div className={styles.controls}>
        <motion.button
          type="button"
          className={styles.play}
          onClick={onToggle}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          aria-label={
            active && playing ? `Pause ${title}` : `Play ${title}`
          }
          aria-pressed={active && playing}
        >
          {active && playing ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        <motion.button
          type="button"
          className={styles.stop}
          onClick={onStop}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          disabled={!active}
          aria-label={`Stop ${title}`}
        >
          <Stop size={17} />
        </motion.button>

        <div className={styles.volumeGroup}>
          <span className={styles.volIcon} aria-hidden="true">
            {volume === 0 ? <VolumeMute size={17} /> : <Volume size={17} />}
          </span>
          <input
            type="range"
            className={styles.volume}
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            aria-label={`Volume for ${title}`}
            aria-valuetext={`${Math.round(volume * 100)} percent`}
            style={{ ["--pct" as string]: `${volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
