"use client";

import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import styles from "./DataExport.module.css";
import type { Activity } from "@/lib/activityStore";

export default function DataExport({ activities }: { activities: Activity[] }) {
  
  const handleExport = () => {
    const dataStr = JSON.stringify(activities, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `psymira-wellness-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Data & Privacy</h2>
      <GlassCard className={styles.card}>
        <div className={styles.info}>
          <h3 className={styles.cardTitle}>Export Wellness Data</h3>
          <p className={styles.cardDesc}>
            Download a complete JSON record of all your logged moods, breathing sessions, and activities. Your data belongs to you.
          </p>
        </div>
        <Button variant="secondary" onClick={handleExport}>Download JSON</Button>
      </GlassCard>
    </div>
  );
}
