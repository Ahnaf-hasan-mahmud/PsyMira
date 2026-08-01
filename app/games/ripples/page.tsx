"use client";

import { useCallback } from "react";
import RippleCanvas from "@/components/games/RippleCanvas";
import GameShell from "@/components/games/GameShell";
import { recordActivity } from "@/lib/activityStore";

export default function RipplesPage() {
  const handleSessionComplete = useCallback(() => {
    recordActivity({
      kind: "game",
      minutes: 5,
      mood: 75,
      calm: 85,
      gameId: "ripples",
      title: "Water Ripples",
    });
  }, []);

  return (
    <GameShell
      title="Water Ripples"
      emoji="💧"
    >
      <RippleCanvas onSessionComplete={handleSessionComplete} />
    </GameShell>
  );
}
