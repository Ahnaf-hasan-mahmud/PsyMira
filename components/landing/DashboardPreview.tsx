"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import MoodLineChart from "@/components/charts/MoodLineChart";
import ReflectionPieChart from "@/components/charts/ReflectionPieChart";
import CalendarHeatmap from "@/components/charts/CalendarHeatmap";
import GrowthTree from "@/components/illustrations/GrowthTree";
import { fadeScale } from "@/lib/motion";
import styles from "./DashboardPreview.module.css";

export default function DashboardPreview() {
  return (
    <section id="dashboard" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Your sanctuary, visualised</span>
          <h2 className={styles.title}>
            A calm view of your <span className="gradient-text">inner weather</span>
          </h2>
          <p className={styles.lede}>
            Soft graphs, a living tree and a quiet calendar — your reflections
            gathered in one beautiful, unclinical place.
          </p>
        </Reveal>

        <motion.div
          className={styles.glass}
          variants={fadeScale}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* fake window chrome */}
          <div className={styles.chrome}>
            <span className={styles.dots}>
              <i style={{ background: "#f4b6c2" }} />
              <i style={{ background: "#f6dca0" }} />
              <i style={{ background: "#bfe3c0" }} />
            </span>
            <span className={styles.chromeTitle}>PsyMira · Dashboard</span>
          </div>

          <div className={styles.grid}>
            <div className={`${styles.panel} ${styles.mood}`}>
              <PanelHead title="Mood Timeline" sub="This week" />
              <MoodLineChart height={200} />
            </div>

            <div className={`${styles.panel} ${styles.tree}`}>
              <PanelHead title="Tree Progress" sub="Level 4 · Blooming" />
              <GrowthTree level={4} size={170} />
            </div>

            <div className={`${styles.panel} ${styles.pie}`}>
              <PanelHead title="Reflection Mix" sub="Last 30 days" />
              <ReflectionPieChart height={170} />
            </div>

            <div className={`${styles.panel} ${styles.heat}`}>
              <PanelHead title="Consistency" sub="17 weeks" />
              <CalendarHeatmap />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PanelHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className={styles.panelHead}>
      <h3 className={styles.panelTitle}>{title}</h3>
      <span className={styles.panelSub}>{sub}</span>
    </div>
  );
}
