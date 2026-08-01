"use client";

import { useCallback } from "react";
import BubbleCanvas from "@/components/games/BubbleCanvas";
import GameShell from "@/components/games/GameShell";
import { recordActivity } from "@/lib/activityStore";

export default function BubblesPage() {
  const handleSessionComplete = useCallback(() => {
    recordActivity({
      kind: "game",
      minutes: 2,
      mood: 70,
      calm: 75,
      gameId: "bubbles",
      title: "Bubble Pop",
    });
  }, []);

  return (
    <GameShell title="Bubble Pop" emoji="🫧">
      <BubbleCanvas onSessionComplete={handleSessionComplete} />
    </GameShell>
  );
}
