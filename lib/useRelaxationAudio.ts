"use client";

/* ============================================================
   useRelaxationAudio
   A single shared HTMLAudioElement drives every card, so only
   one soundscape can ever play at once — starting a new track
   automatically stops the previous one. The element is created
   lazily on first play (no audio is fetched until needed) and
   fully torn down when the page unmounts, so playback always
   stops when the user leaves.
   ============================================================ */
import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundKey, Soundtrack } from "./relaxationData";

const DEFAULT_VOLUME = 0.7;

export type RelaxationAudio = {
  currentId: SoundKey | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  isFading: boolean;
  volumeOf: (id: SoundKey) => number;
  toggle: (track: Soundtrack) => void;
  stop: () => void;
  seek: (seconds: number) => void;
  setVolume: (id: SoundKey, value: number) => void;
  fadeOutAndStop: (ms?: number) => void;
};

export function useRelaxationAudio(): RelaxationAudio {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const volumesRef = useRef<Record<string, number>>({});

  const [currentId, setCurrentId] = useState<SoundKey | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const volumeOf = useCallback(
    (id: SoundKey) => volumesRef.current[id] ?? DEFAULT_VOLUME,
    []
  );

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      window.clearInterval(fadeRef.current);
      fadeRef.current = null;
    }
    setIsFading(false);
  }, []);

  /** Create (once) and wire up the shared audio element. */
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.preload = "none"; // lazy — nothing is fetched until we call load()/play()
    el.loop = true;
    el.addEventListener("timeupdate", () => setCurrentTime(el.currentTime));
    el.addEventListener("durationchange", () =>
      setDuration(Number.isFinite(el.duration) ? el.duration : 0)
    );
    el.addEventListener("loadedmetadata", () =>
      setDuration(Number.isFinite(el.duration) ? el.duration : 0)
    );
    el.addEventListener("playing", () => {
      setIsPlaying(true);
      setIsLoading(false);
    });
    el.addEventListener("waiting", () => setIsLoading(true));
    el.addEventListener("pause", () => setIsPlaying(false));
    audioRef.current = el;
    return el;
  }, []);

  const playTrack = useCallback(
    (track: Soundtrack) => {
      clearFade();
      const el = ensureAudio();
      const vol = volumeOf(track.id);

      // Switching tracks: swap the source and reset the timeline.
      const srcChanged = !el.src.endsWith(track.src);
      if (srcChanged) {
        el.src = track.src;
        el.load(); // begins fetching only now
        setCurrentTime(0);
        setDuration(0);
      }
      el.volume = vol;
      setCurrentId(track.id);
      setIsLoading(true);
      void el.play().catch(() => setIsLoading(false));
    },
    [clearFade, ensureAudio, volumeOf]
  );

  const pause = useCallback(() => {
    clearFade();
    audioRef.current?.pause();
  }, [clearFade]);

  const stop = useCallback(() => {
    clearFade();
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setCurrentId(null);
  }, [clearFade]);

  const toggle = useCallback(
    (track: Soundtrack) => {
      if (currentId === track.id && isPlaying) {
        pause();
      } else {
        playTrack(track);
      }
    },
    [currentId, isPlaying, pause, playTrack]
  );

  const seek = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = Math.max(0, Math.min(seconds, el.duration));
    setCurrentTime(el.currentTime);
  }, []);

  const setVolume = useCallback(
    (id: SoundKey, value: number) => {
      const v = Math.max(0, Math.min(1, value));
      volumesRef.current[id] = v;
      if (id === currentId && audioRef.current && !isFading) {
        audioRef.current.volume = v;
      }
    },
    [currentId, isFading]
  );

  const fadeOutAndStop = useCallback(
    (ms = 4000) => {
      const el = audioRef.current;
      if (!el || el.paused) {
        stop();
        return;
      }
      clearFade();
      setIsFading(true);
      const startVol = el.volume;
      const startTime = performance.now();
      fadeRef.current = window.setInterval(() => {
        const t = (performance.now() - startTime) / ms;
        if (t >= 1) {
          el.volume = 0;
          clearFade();
          const restore = currentId ? volumeOf(currentId) : DEFAULT_VOLUME;
          stop();
          el.volume = restore; // reset for the next play
          return;
        }
        el.volume = startVol * (1 - t);
      }, 60);
    },
    [clearFade, currentId, stop, volumeOf]
  );

  // Stop playback and clean everything up when the page unmounts.
  useEffect(() => {
    return () => {
      clearFade();
      const el = audioRef.current;
      if (el) {
        el.pause();
        el.removeAttribute("src");
        el.load();
        audioRef.current = null;
      }
    };
  }, [clearFade]);

  return {
    currentId,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    isFading,
    volumeOf,
    toggle,
    stop,
    seek,
    setVolume,
    fadeOutAndStop,
  };
}
