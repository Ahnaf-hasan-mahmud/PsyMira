"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { reflectionMix } from "./sampleData";
import { createClient } from "./supabase/client";
import { notifyActivityLogged, notifyStreakMilestone } from "./notifications";

const STORAGE_KEY = "psymira.activity.v2";
const CHANGE_EVENT = "psymira:activity-change";

export type ActivityKind = "story" | "breathing" | "mood" | "game";

export type Activity = {
  id: string;
  kind: ActivityKind;
  createdAt: string;
  minutes: number;
  mood: number;
  calm: number;
  storyId?: "silent-lake" | "ordinary-monday" | "homecoming" | string;
  title?: string;
  emotion?: string;
  technique?: string;
  gameId?: string;
};

export async function fetchActivities(): Promise<Activity[]> {
  if (typeof window === "undefined") return [];
  
  // 1. Try Supabase Sync
  const supabase = createClient();
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (!error && data) {
        // Map from DB snake_case to client camelCase
        const mapped = data.map(row => ({
          id: row.id,
          kind: row.kind,
          createdAt: row.created_at,
          minutes: row.minutes,
          mood: row.mood,
          calm: row.calm,
          storyId: row.story_id,
          title: row.title,
          emotion: row.emotion,
          technique: row.technique,
          gameId: row.game_id,
        }));
        // Update local cache so offline works instantly next time
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
        return mapped as Activity[];
      }
    }
  }

  // 2. Fallback to Local Storage
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function recordActivity(activity: Omit<Activity, "id" | "createdAt">) {
  if (typeof window === "undefined") return;
  
  const next: Activity = {
    ...activity,
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };

  // Optimistic UI Update (Local Storage)
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    const current = Array.isArray(parsed) ? parsed : [];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, next]));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch (e) {}

  // Sync to Cloud
  const supabase = createClient();
  if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('activities').insert({
          user_id: session.user.id,
          kind: activity.kind,
          minutes: activity.minutes,
          mood: activity.mood,
          calm: activity.calm,
          story_id: activity.storyId,
          title: activity.title,
          emotion: activity.emotion,
          technique: activity.technique,
          game_id: activity.gameId,
          created_at: next.createdAt,
        });

        // Auto-trigger in-app notification
        const xpMap: Record<string, number> = { story: 120, breathing: 20, game: 15, mood: 5 };
        const xp = xpMap[activity.kind] ?? 10;
        await notifyActivityLogged(session.user.id, activity.kind, xp);
      }
  }
}

export function saveStoryPicks(storyId: string, picks: any[]) {
  if (typeof window === "undefined") return;
  const key = `psymira.story.picks.${storyId}`;
  window.localStorage.setItem(key, JSON.stringify(picks));
}

export function getStoryPicks(storyId: string): any[] | null {
  if (typeof window === "undefined") return null;
  const key = `psymira.story.picks.${storyId}`;
  try {
    const data = window.localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const DAY_MS = 86_400_000;
const dayKey = (date: Date) => date.toISOString().slice(0, 10);
const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function useActivityDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    // 1. Optimistic fast-load from local storage
    try {
      const localParsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(localParsed) && localParsed.length > 0) {
        setActivities(localParsed);
        setReady(true);
      }
    } catch (e) {}

    // 2. Fetch ground truth from Cloud
    const cloudData = await fetchActivities();
    setActivities(cloudData);
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
      (activity) =>
        activity.kind === "story" ||
        activity.kind === "breathing" ||
        activity.kind === "game"
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
    const gameRounds = completed.filter((a) => a.kind === "game").length;
    const xp = storyCompletions.length * 120 + breathingRounds * 20 + gameRounds * 15;

    const uniqueDays = [...new Set(completed.map((a) => dayKey(new Date(a.createdAt))))].sort().reverse();
    let streak = 0;
    for (let offset = 0; offset < 365; offset += 1) {
      const key = dayKey(new Date(now.getTime() - offset * DAY_MS));
      if (uniqueDays.includes(key)) streak += 1;
      else if (offset > 0 || completed.length > 0) break;
    }
    
    // New Advanced Metrics
    const validMoods = completed.filter(a => a.mood > 0).map(a => a.mood);
    const avgMood = validMoods.length ? Math.round(validMoods.reduce((a,b)=>a+b,0) / validMoods.length) : 0;
    const mostLoggedMood = mixData.length > 0 && mixData[0].value > 0 ? mixData[0].name : "None";
    
    // Favorites
    const getFav = (kind: string, keyFunc: (a: Activity) => string | undefined) => {
      const items = completed.filter(a => a.kind === kind);
      const counts = new Map<string, number>();
      items.forEach(i => {
        const k = keyFunc(i);
        if (k) counts.set(k, (counts.get(k) || 0) + 1);
      });
      let best = "None", max = 0;
      counts.forEach((v, k) => { if (v > max) { max = v; best = k; } });
      return best;
    };
    
    const favBreathing = getFav("breathing", a => a.technique);
    const favStory = getFav("story", a => a.emotion); // using emotion as proxy for theme
    const favGame = getFav("game", a => a.title);

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
      avgMood,
      mostLoggedMood,
      favBreathing,
      favStory,
      favGame,
    };
  }, [activities]);

  return { ...analytics, activities, ready, refresh };
}
