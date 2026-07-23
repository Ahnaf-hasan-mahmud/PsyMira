"use client";

/* ============================================================
   Favorite soundscapes — persisted to localStorage, mirrored
   across tabs. Same pattern as diaryStore / activityStore.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import type { SoundId } from "./relaxationData";

const STORAGE_KEY = "psymira.relaxation.favorites.v1";
const CHANGE_EVENT = "psymira:relaxation-favorites-change";

function readFavorites(): SoundId[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? (value as SoundId[]) : [];
  } catch {
    return [];
  }
}

function writeFavorites(next: SoundId[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<SoundId[]>([]);

  const refresh = useCallback(() => setFavorites(readFavorites()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const toggleFavorite = useCallback((id: SoundId) => {
    const current = readFavorites();
    const next = current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id];
    writeFavorites(next);
  }, []);

  const isFavorite = useCallback(
    (id: SoundId) => favorites.includes(id),
    [favorites]
  );

  return { favorites, isFavorite, toggleFavorite };
}
