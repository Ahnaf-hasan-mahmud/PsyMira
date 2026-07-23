"use client";

/* ============================================================
   useRelaxationPlayer
   A single shared <audio> element drives the whole page, so only
   one soundscape can ever play at a time — starting a new track
   automatically stops the previous one. Also owns the sleep
   timer (with a smooth volume fade-out) and cleans everything
   up when the page unmounts or is hidden.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundId, Soundscape } from "./relaxationData";

const DEFAULT_VOLUME = 0.7;
const FADE_MS = 4000; // gentle fade before the timer stops playback
const FADE_STEP_MS = 80;

export type TimerMinutes = 15 | 30 | 45 | 60;

export function useRelaxationPlayer(tracks: Soundscape[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  const [activeId, setActiveId] = useState<SoundId | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // per-track volume, remembered while the page is open
  const [volumes, setVolumes] = useState<Record<string, number>>(() =>
    Object.fromEntries(tracks.map((t) => [t.id, DEFAULT_VOLUME]))
  );

  const [timerMinutes, setTimerMinutes] = useState<TimerMinutes | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  /* ---- lazily create the shared element (preload none) ---- */
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "none";
      el.loop = true;
      audioRef.current = el;

      el.addEventListener("timeupdate", () =>
        setCurrentTime(el.currentTime || 0)
      );
      el.addEventListener("loadedmetadata", () =>
        setDuration(Number.isFinite(el.duration) ? el.duration : 0)
      );
      el.addEventListener("play", () => setIsPlaying(true));
      el.addEventListener("pause", () => setIsPlaying(false));
    }
    return audioRef.current;
  }, []);

  const clearFade = useCallback(() => {
    if (fadeRef.current) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
    setIsFading(false);
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      window.clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  /* ---- transport ---- */
  const stop = useCallback(() => {
    clearFade();
    clearCountdown();
    setTimerMinutes(null);
    setRemaining(null);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setActiveId(null);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [clearFade, clearCountdown]);

  const play = useCallback(
    (track: Soundscape) => {
      clearFade();
      const el = getAudio();
      const vol = volumes[track.id] ?? DEFAULT_VOLUME;

      // switching tracks: load the new source (stops the previous one)
      if (activeId !== track.id) {
        el.src = track.src;
        el.load();
        el.currentTime = 0;
        setCurrentTime(0);
        setDuration(0);
        setActiveId(track.id);
      }
      el.volume = vol;
      void el.play().catch(() => setIsPlaying(false));
    },
    [activeId, getAudio, volumes, clearFade]
  );

  const toggle = useCallback(
    (track: Soundscape) => {
      const el = audioRef.current;
      if (activeId === track.id && isPlaying && el) {
        el.pause();
        return;
      }
      play(track);
    },
    [activeId, isPlaying, play]
  );

  const seek = useCallback(
    (id: SoundId, time: number) => {
      if (activeId !== id) return;
      const el = audioRef.current;
      if (el) {
        el.currentTime = time;
        setCurrentTime(time);
      }
    },
    [activeId]
  );

  const setVolume = useCallback(
    (id: SoundId, value: number) => {
      setVolumes((prev) => ({ ...prev, [id]: value }));
      if (activeId === id && audioRef.current && !isFading) {
        audioRef.current.volume = value;
      }
    },
    [activeId, isFading]
  );

  /* ---- sleep timer with fade-out ---- */
  const beginFadeOut = useCallback(() => {
    const el = audioRef.current;
    if (!el) return stop();
    setIsFading(true);
    const start = el.volume;
    const steps = Math.max(1, Math.round(FADE_MS / FADE_STEP_MS));
    let step = 0;
    fadeRef.current = window.setInterval(() => {
      step += 1;
      const next = Math.max(0, start * (1 - step / steps));
      el.volume = next;
      if (step >= steps) {
        clearFade();
        stop();
      }
    }, FADE_STEP_MS);
  }, [clearFade, stop]);

  const setTimer = useCallback(
    (minutes: TimerMinutes | null) => {
      clearCountdown();
      clearFade();
      if (minutes == null) {
        setTimerMinutes(null);
        setRemaining(null);
        // restore volume if a fade had begun
        if (activeId && audioRef.current) {
          audioRef.current.volume = volumes[activeId] ?? DEFAULT_VOLUME;
        }
        return;
      }
      setTimerMinutes(minutes);
      const total = minutes * 60;
      setRemaining(total);
      countdownRef.current = window.setInterval(() => {
        setRemaining((prev) => {
          if (prev == null) return prev;
          const next = prev - 1;
          if (next <= FADE_MS / 1000) {
            clearCountdown();
            beginFadeOut();
            return 0;
          }
          return next;
        });
      }, 1000);
    },
    [activeId, volumes, clearCountdown, clearFade, beginFadeOut]
  );

  /* ---- cleanup: unmount + tab hidden / navigation away ---- */
  useEffect(() => {
    const pauseOnHide = () => {
      if (document.hidden && audioRef.current) audioRef.current.pause();
    };
    document.addEventListener("visibilitychange", pauseOnHide);
    window.addEventListener("pagehide", pauseOnHide);
    return () => {
      document.removeEventListener("visibilitychange", pauseOnHide);
      window.removeEventListener("pagehide", pauseOnHide);
      clearFade();
      clearCountdown();
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.src = "";
      }
      audioRef.current = null;
    };
  }, [clearFade, clearCountdown]);

  return {
    activeId,
    isPlaying,
    currentTime,
    duration,
    volumes,
    isFading,
    timerMinutes,
    remaining,
    toggle,
    stop,
    seek,
    setVolume,
    setTimer,
  };
}
