"use client";

import { useCallback } from "react";
import ColoringCanvas from "@/components/games/ColoringCanvas";
import GameShell from "@/components/games/GameShell";
import { recordActivity } from "@/lib/activityStore";

export default function ColoringPage() {
  const handleSessionComplete = useCallback(() => {
    recordActivity({
      kind: "game",
      minutes: 10,
      mood: 80,
      calm: 80,
      gameId: "coloring",
      title: "Coloring Pages",
    });
  }, []);

  return (
    <GameShell
      title="Coloring Pages"
      emoji="🎨"
    >
      <ColoringCanvas onSessionComplete={handleSessionComplete} />
    </GameShell>
  );
}
