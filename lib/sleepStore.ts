"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";

const STORAGE_KEY = "psymira.sleep.v1";
const CHANGE_EVENT = "psymira:sleep-change";

export type SleepQuality = "poor" | "okay" | "good" | "great";

export type SleepEntry = {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  hoursSlept: number;
  quality: SleepQuality;
  notes?: string;
  createdAt: string;
};

// Initial mock data to make the dashboard look good on first load
const INITIAL_MOCK: SleepEntry[] = [
  {
    id: "mock-1",
    date: new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
    bedtime: "23:00",
    wakeTime: "06:30",
    hoursSlept: 7.5,
    quality: "good",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-2",
    date: new Date(Date.now() - 5 * 86400000).toISOString().split("T")[0],
    bedtime: "23:30",
    wakeTime: "07:00",
    hoursSlept: 7.5,
    quality: "okay",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-3",
    date: new Date(Date.now() - 4 * 86400000).toISOString().split("T")[0],
    bedtime: "01:00",
    wakeTime: "06:00",
    hoursSlept: 5.0,
    quality: "poor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-4",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    bedtime: "22:00",
    wakeTime: "06:30",
    hoursSlept: 8.5,
    quality: "great",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-5",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    bedtime: "23:15",
    wakeTime: "07:15",
    hoursSlept: 8.0,
    quality: "good",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-6",
    date: new Date(Date.now() - 1 * 86400000).toISOString().split("T")[0],
    bedtime: "00:30",
    wakeTime: "06:30",
    hoursSlept: 6.0,
    quality: "okay",
    createdAt: new Date().toISOString(),
  },
];

export function readSleepData(): SleepEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK));
      return INITIAL_MOCK;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function calculateHoursSlept(bedtime: string, wakeTime: string): number {
  const [bH, bM] = bedtime.split(":").map(Number);
  const [wH, wM] = wakeTime.split(":").map(Number);

  let bedDate = new Date();
  bedDate.setHours(bH, bM, 0, 0);

  let wakeDate = new Date();
  wakeDate.setHours(wH, wM, 0, 0);

  if (wakeDate <= bedDate) {
    wakeDate.setDate(wakeDate.getDate() + 1);
  }

  const diffMs = wakeDate.getTime() - bedDate.getTime();
  return Number((diffMs / (1000 * 60 * 60)).toFixed(1));
}

/** Write to localStorage + sync to Supabase if authenticated */
export async function recordSleep(entry: Omit<SleepEntry, "id" | "createdAt" | "hoursSlept">) {
  if (typeof window === "undefined") return;

  const hoursSlept = calculateHoursSlept(entry.bedtime, entry.wakeTime);
  const next: SleepEntry = {
    ...entry,
    hoursSlept,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  // 1. Write localStorage immediately (optimistic)
  const existing = readSleepData();
  const filtered = existing.filter((e) => e.date !== next.date);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...filtered, next]));
  window.dispatchEvent(new Event(CHANGE_EVENT));

  // 2. Sync to Supabase in the background
  try {
    const supabase = createClient();
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Upsert — unique constraint on (user_id, date)
        await supabase.from("sleep_entries").upsert(
          {
            user_id: session.user.id,
            date: next.date,
            bedtime: next.bedtime,
            wake_time: next.wakeTime,
            hours_slept: next.hoursSlept,
            quality: next.quality,
            notes: next.notes ?? null,
          },
          { onConflict: "user_id,date" }
        );
      }
    }
  } catch {
    // Supabase sync failure is non-fatal; local data is already saved
  }
}

/** Fetch from Supabase if authenticated, otherwise fall back to localStorage */
async function fetchSleepEntries(): Promise<SleepEntry[]> {
  try {
    const supabase = createClient();
    if (supabase) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("sleep_entries")
          .select("*")
          .order("date", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: SleepEntry[] = data.map((row) => ({
            id: row.id,
            date: row.date,
            bedtime: row.bedtime,
            wakeTime: row.wake_time,
            hoursSlept: Number(row.hours_slept),
            quality: row.quality as SleepQuality,
            notes: row.notes ?? undefined,
            createdAt: row.created_at,
          }));
          // Update local cache
          if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
          }
          return mapped;
        }
      }
    }
  } catch {
    // Fall through to localStorage
  }
  return readSleepData();
}

export function useSleepDashboard() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);

  useEffect(() => {
    // Hydrate from localStorage immediately, then sync from Supabase
    setEntries(readSleepData());
    fetchSleepEntries().then(setEntries);

    function onLocalChange() {
      setEntries(readSleepData());
    }
    window.addEventListener(CHANGE_EVENT, onLocalChange);
    return () => window.removeEventListener(CHANGE_EVENT, onLocalChange);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const hasLoggedToday = entries.some((e) => e.date === todayStr);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const last7Days = sortedEntries.slice(-7);

  const avgSleepHours =
    last7Days.length > 0
      ? Number(
          (
            last7Days.reduce((sum, e) => sum + e.hoursSlept, 0) /
            last7Days.length
          ).toFixed(1)
        )
      : 0;

  const bestNight = last7Days.reduce((best, current) => {
    if (!best) return current;
    return current.hoursSlept > best.hoursSlept ? current : best;
  }, null as SleepEntry | null);

  const chartData = last7Days.map((e) => ({
    date: e.date,
    dayName: new Date(e.date).toLocaleDateString("en-US", { weekday: "short" }),
    hours: e.hoursSlept,
    quality: e.quality,
  }));

  return {
    entries: sortedEntries,
    recentEntries: last7Days,
    chartData,
    avgSleepHours,
    hasLoggedToday,
    bestNight,
  };
}
