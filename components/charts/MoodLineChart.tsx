"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { moodTrend } from "@/lib/sampleData";
import ChartTooltip from "./ChartTooltip";

/** Soft area-line of mood vs calm across the week. */
export default function MoodLineChart({
  data = moodTrend,
  height = 220,
}: {
  data?: typeof moodTrend;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="calmFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity={0} />
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
          domain={[0, 100]}
        />
        <Tooltip
          content={<ChartTooltip unit="" />}
          cursor={{ stroke: "#ddd6fe", strokeWidth: 1.5 }}
        />
        <Area
          type="monotone"
          dataKey="calm"
          stroke="#c4b5fd"
          strokeWidth={2.5}
          fill="url(#calmFill)"
          dot={false}
          animationDuration={1100}
        />
        <Area
          type="monotone"
          dataKey="mood"
          stroke="#8b6df0"
          strokeWidth={3}
          fill="url(#moodFill)"
          dot={false}
          activeDot={{ r: 5, fill: "#8b6df0", stroke: "#fff", strokeWidth: 2 }}
          animationDuration={1300}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
