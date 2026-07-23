"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

type Datum = { trait: string; value: number; positive: boolean };

/**
 * Radar / "emotion wheel" of all eleven traits, normalised 0–10.
 * Purely visual — the readable status lives in the badge grid.
 */
export default function TraitRadar({
  data,
  height = 300,
}: {
  data: Datum[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <RadarChart data={data} outerRadius="72%">
          <defs>
            <linearGradient id="traitFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#8b6df0" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="#e0d6f2" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: "#706a7a", fontSize: 11, fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 10]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="#8b6df0"
            strokeWidth={2}
            fill="url(#traitFill)"
            dot={{ r: 3, fill: "#8b6df0" }}
            isAnimationActive
            animationDuration={1200}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
