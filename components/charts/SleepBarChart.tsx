"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { SleepQuality } from "@/lib/sleepStore";

type SleepDataPoint = {
  date: string;
  dayName: string;
  hours: number;
  quality: SleepQuality;
};

const QUALITY_COLORS: Record<SleepQuality, string> = {
  great: "#8b6df0",
  good: "#a78bfa",
  okay: "#c4b5fd",
  poor: "#e3d9f7",
};

/** Weekly sleep hours bar chart */
export default function SleepBarChart({
  data = [],
  height = 220,
  theme = "light",
}: {
  data?: SleepDataPoint[];
  height?: number;
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark";
  const gridColor = isDark ? "#2e2559" : "#ece6f5";
  const tickColor = isDark ? "#a78bfa" : "#9b94a8";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="dayName"
          tickLine={false}
          axisLine={false}
          tick={{ fill: tickColor, fontSize: 12 }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: tickColor, fontSize: 12 }}
        />
        <Tooltip
          content={<ChartTooltip unit=" hr" />}
          cursor={{ fill: "rgba(167,139,250,0.08)" }}
        />
        <Bar dataKey="hours" radius={[8, 8, 8, 8]} animationDuration={1100}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={QUALITY_COLORS[d.quality] || "#e3d9f7"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
