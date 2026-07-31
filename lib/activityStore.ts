"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { reflectionMix } from "./sampleData";

const STORAGE_KEY = "psymira.activity.v2";
const CHANGE_EVENT = "psymira:activity-change";

export type ActivityKind = "story" | "breathing" | "mood";

export type Activity = {
  id: string;
  kind: ActivityKind;
  createdAt: string;
  minutes: number;
  mood: number;
  calm: number;
  storyId?: "silent-lake" | "ordinary-monday" | "homecoming";
  title?: string;
  emotion?: string;
  technique?: string;
};

function readActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordActivity(activity: Omit<Activity, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  const next: Activity = {
    ...activity,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...readActivities(), next]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const DAY_MS = 86_400_000;
const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function useActivityDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setActivities(readActivities());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CHANGE_EVENT, refresh);
    };
  }, [refresh]);

  const analytics = useMemo(() => {
    const now = new Date();
    // Dashboard progress is earned only through a completed story or a full
    // breathing round. Mood check-ins remain saved, but do not inflate it.
    const completed = activities.filter(
      (activity) => activity.kind === "story" || activity.kind === "breathing"
    );
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now.getTime() - (6 - index) * DAY_MS);
      return {
        key: dayKey(date),
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
      };
    });

    const moodData = days.map((day, index) => {
      const daily = completed.filter((a) => dayKey(new Date(a.createdAt)) === day.key);
      if (!daily.length) return { day: day.day, mood: 0, calm: 0 };
      return {
        day: day.day,
        mood: clamp(daily.reduce((sum, a) => sum + a.mood, 0) / daily.length),
        calm: clamp(daily.reduce((sum, a) => sum + a.calm, 0) / daily.length),
      };
    });

    const activityData = days.map((day, index) => {
      const minutes = completed
        .filter((a) => dayKey(new Date(a.createdAt)) === day.key)
        .reduce((sum, a) => sum + a.minutes, 0);
      return {
        day: day.day,
        minutes: minutes ? Math.max(1, Math.round(minutes)) : 0,
      };
    });

    const activeDayKeys = new Set(
      completed
        .filter((a) => now.getTime() - new Date(a.createdAt).getTime() < 7 * DAY_MS)
        .map((a) => dayKey(new Date(a.createdAt)))
    );
    const consistency = Math.round((activeDayKeys.size / 7) * 100);

    const moodCounts = new Map<string, number>();
    completed.forEach((a) => {
      const label = a.emotion || (a.kind === "breathing" ? "Calm" : "Reflective");
      moodCounts.set(label, (moodCounts.get(label) ?? 0) + 1);
    });
    const totalMoods = [...moodCounts.values()].reduce((a, b) => a + b, 0);
    const palette = ["#a78bfa", "#c4b5fd", "#ecd9c4", "#ddd6fe", "#c8c2d2"];
    const mixData = totalMoods
      ? [...moodCounts.entries()].slice(0, 5).map(([name, value], index) => ({
          name,
          value: Math.round((value / totalMoods) * 100),
          color: palette[index],
        }))
      : reflectionMix.map((item) => ({ ...item, value: 0 }));

    const storyCompletions = completed.filter((a) => a.kind === "story");
    const completedStories = new Set(storyCompletions.map((a) => a.storyId));
    const breathingRounds = completed.filter((a) => a.kind === "breathing").length;
    const xp = storyCompletions.length * 120 + breathingRounds * 20;

    const uniqueDays = [...new Set(completed.map((a) => dayKey(new Date(a.createdAt))))].sort().reverse();
    let streak = 0;
    for (let offset = 0; offset < 365; offset += 1) {
      const key = dayKey(new Date(now.getTime() - offset * DAY_MS));
      if (uniqueDays.includes(key)) streak += 1;
      else if (offset > 0 || completed.length > 0) break;
    }

    return {
      moodData,
      activityData,
      mixData,
      consistency,
      completedStories,
      breathingRounds,
      xp,
      streak,
      totalActivities: completed.length,
    };
  }, [activities]);

  return { ...analytics, activities, ready, refresh };
}
