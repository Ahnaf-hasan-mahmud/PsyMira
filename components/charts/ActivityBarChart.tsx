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
import { weeklyActivity } from "@/lib/sampleData";
import ChartTooltip from "./ChartTooltip";

/** Weekly minutes-of-reflection bars with a gentle rounded top. */
export default function ActivityBarChart({
  data = weeklyActivity,
  height = 220,
}: {
  data?: typeof weeklyActivity;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.minutes));
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#c4b5fd" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ece6f5" vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9b94a8", fontSize: 12 }}
          dy={6}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#9b94a8", fontSize: 12 }}
        />
        <Tooltip
          content={<ChartTooltip unit=" min" />}
          cursor={{ fill: "rgba(167,139,250,0.08)" }}
        />
        <Bar dataKey="minutes" radius={[8, 8, 8, 8]} animationDuration={1100}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.minutes === max ? "url(#barFill)" : "#e3d9f7"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
