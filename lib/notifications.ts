"use client";

import { createClient } from "./supabase/client";

const NOTIFICATION_EVENT = "psymira:notification-new";

type NotificationPayload = {
  userId: string;
  title: string;
  body: string;
};

export async function pushNotification({ userId, title, body }: NotificationPayload) {
  const supabase = createClient();
  if (!supabase || !userId) return;

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title,
    body,
    read: false,
  });

  if (error) {
    console.error("Supabase Notification Insert Error:", error);
  }

  // Signal the dropdown to refresh immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NOTIFICATION_EVENT));
  }
}

// Pre-built notification triggers
export async function notifyActivityLogged(userId: string, kind: string, xp: number) {
  const messages: Record<string, { title: string; body: string }> = {
    breathing: {
      title: "Breathing Session Logged",
      body: `You completed a breathing exercise. +${xp} XP earned. Keep going! 🌬️`,
    },
    story: {
      title: "Story Completed",
      body: `You finished a story reflection. +${xp} XP earned. Beautiful work! 📖`,
    },
    game: {
      title: "Game Session Complete",
      body: `You played a wellness game. +${xp} XP earned. Stay playful! 🎮`,
    },
    mood: {
      title: "Mood Check-in Logged",
      body: `Your mood was recorded. Tracking how you feel is a superpower. 😊`,
    },
  };

  const msg = messages[kind] ?? { title: "Activity Logged", body: `You completed an activity. +${xp} XP!` };
  await pushNotification({ userId, ...msg });
}

export async function notifyBadgeUnlocked(userId: string, badgeName: string) {
  await pushNotification({
    userId,
    title: `🏆 Badge Unlocked: ${badgeName}`,
    body: `Congratulations! You earned the "${badgeName}" achievement. Keep it up!`,
  });
}

export async function notifyStreakMilestone(userId: string, streak: number) {
  await pushNotification({
    userId,
    title: `🔥 ${streak}-Day Streak!`,
    body: `You've been consistent for ${streak} days straight. That's incredible willpower!`,
  });
}
