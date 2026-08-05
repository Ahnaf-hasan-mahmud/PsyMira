"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "psymira.diary.v1";
const CHANGE_EVENT = "psymira:diary-change";

export type DiaryEntry = {
  date: string;
  dayNotes: string;
  goals: string;
  goalCompleted?: boolean;
  updatedAt: string;
};

function readEntries(): DiaryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function saveDiaryEntry(entry: Omit<DiaryEntry, "updatedAt">) {
  const entries = readEntries().filter((item) => item.date !== entry.date);
  const next = { ...entry, updatedAt: new Date().toISOString() };
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...entries, next].sort((a, b) => b.date.localeCompare(a.date)))
  );
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useDiaryEntries() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const refresh = useCallback(() => setEntries(readEntries()), []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  return entries;
}
