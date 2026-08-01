"use client";

import { useState, useCallback } from "react";
import SandCanvas from "@/components/games/SandCanvas";
import GameShell from "@/components/games/GameShell";
import ColorPalette from "@/components/games/ColorPalette";
import { recordActivity } from "@/lib/activityStore";

const SAND_COLORS = [
  "#d4a76a",
  "#c4945a",
  "#e6c88a",
  "#b8845a",
  "#dbb87a",
  "#c8a070",
  "#a8784a",
];

export default function SandPage() {
  const [activeColor, setActiveColor] = useState(SAND_COLORS[0]);

  const handleSessionComplete = useCallback(() => {
    recordActivity({
      kind: "game",
      minutes: 5,
      mood: 75,
      calm: 80,
      gameId: "sand",
      title: "Sand Simulator",
    });
  }, []);

  return (
    <GameShell
      title="Sand Simulator"
      emoji="🏖️"
      toolbar={
        <ColorPalette
          colors={SAND_COLORS}
          active={activeColor}
          onChange={setActiveColor}
        />
      }
    >
      <SandCanvas
        activeColor={activeColor}
        onSessionComplete={handleSessionComplete}
      />
    </GameShell>
  );
}
