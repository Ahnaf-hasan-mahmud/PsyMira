"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { reflectionMix } from "@/lib/sampleData";
import ChartTooltip from "./ChartTooltip";
import styles from "./ReflectionPieChart.module.css";

/** Donut of the emotional "weather" mix, with a soft legend. */
export default function ReflectionPieChart({
  data = reflectionMix,
  height = 220,
}: {
  data?: typeof reflectionMix;
  height?: number;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.chart} style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip unit="%" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={3}
              stroke="none"
              animationDuration={1100}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.center}>
          <span className={styles.centerNum}>
            {data.filter((item) => item.value > 0).length}
          </span>
          <span className={styles.centerLabel}>moods</span>
        </div>
      </div>

      <ul className={styles.legend}>
        {data.map((d) => (
          <li key={d.name} className={styles.legendItem}>
            <span className={styles.swatch} style={{ background: d.color }} />
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendVal}>{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
