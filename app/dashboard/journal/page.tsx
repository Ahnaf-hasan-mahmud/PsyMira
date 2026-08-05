"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import TopNav from "@/components/dashboard/TopNav";
import { Check, Feather } from "@/components/ui/Icons";
import { saveDiaryEntry, useDiaryEntries } from "@/lib/diaryStore";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "../tracker.module.css";

const today = new Date().toISOString().slice(0, 10);

export default function JournalPage() {
  const entries = useDiaryEntries();
  const [selectedDate, setSelectedDate] = useState(today);
  const [dayNotes, setDayNotes] = useState("");
  const [goals, setGoals] = useState("");
  const [goalCompleted, setGoalCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  const isPast = selectedDate !== today;

  const selected = useMemo(
    () => entries.find((entry) => entry.date === selectedDate),
    [entries, selectedDate]
  );

  useEffect(() => {
    setDayNotes(selected?.dayNotes ?? "");
    setGoals(selected?.goals ?? "");
    setGoalCompleted(selected?.goalCompleted ?? false);
    setSaved(false);
  }, [selected]);

  function handleSave() {
    saveDiaryEntry({ date: selectedDate, dayNotes: dayNotes.trim(), goals: goals.trim(), goalCompleted });
    setSaved(true);
  }

  return (
    <>
      <TopNav name="Aria" />
      <motion.main className={styles.page} variants={stagger(0.08)} initial="hidden" animate="show">
        <motion.header className={styles.hero} variants={fadeUp}>
          <span className={styles.eyebrow}><Feather size={16} /> Daily journal</span>
          <h1 className={styles.title}>Make space for your day.</h1>
          <p className={styles.lede}>
            Capture what you have been doing, how the day felt, and what you want to move toward next.
          </p>
        </motion.header>

        <div className={styles.journalGrid}>
          <motion.section className={styles.editor} variants={fadeUp}>
            <div className={styles.sectionHead}>
              <div>
                <span className={styles.smallLabel}>Entry date</span>
                <h2 className={styles.sectionTitle}>{formatDate(selectedDate)}</h2>
              </div>
              <input
                className={styles.dateInput}
                type="date"
                value={selectedDate}
                max={today}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <label className={styles.field}>
              <span className={styles.prompt}>What have you been doing today?</span>
              <span className={styles.hint}>Moments, work, people, thoughts—anything that mattered.</span>
              <textarea
                value={dayNotes}
                onChange={(event) => { setDayNotes(event.target.value); setSaved(false); }}
                placeholder={isPast ? "No notes for this day." : "Today I…"}
                readOnly={isPast}
                rows={7}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.prompt}>What are your goals?</span>
              <span className={styles.hint}>Add one gentle intention for tomorrow or the days ahead.</span>
              <textarea
                value={goals}
                onChange={(event) => { setGoals(event.target.value); setSaved(false); }}
                placeholder={isPast ? "No goals for this day." : "I would like to…"}
                readOnly={isPast}
                rows={4}
              />
              {isPast && goals.trim().length > 0 && (
                <label className={styles.checkboxWrapper} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={goalCompleted} 
                    onChange={(e) => {
                      setGoalCompleted(e.target.checked);
                      setSaved(false);
                    }} 
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)' }}>I completed this goal</span>
                </label>
              )}
            </label>

            {!isPast || (isPast && goals.trim().length > 0) ? (
              <button className={styles.primaryButton} type="button" onClick={handleSave}>
                <Check size={17} /> {saved ? "Entry saved" : (isPast ? "Save goal status" : "Save journal entry")}
              </button>
            ) : null}
          </motion.section>

          <motion.aside className={styles.history} variants={fadeUp}>
            <h2 className={styles.sectionTitle}>Previous entries</h2>
            <p className={styles.muted}>Return to a day whenever you want to add or reflect.</p>
            <div className={styles.entryList}>
              {entries.length ? entries.map((entry) => (
                <button
                  type="button"
                  key={entry.date}
                  className={`${styles.entryButton} ${entry.date === selectedDate ? styles.entryActive : ""} ${entry.goalCompleted ? styles.entryCompleted : ""}`}
                  onClick={() => setSelectedDate(entry.date)}
                >
                  <span>{formatDate(entry.date)}</span>
                  <small>{entry.dayNotes || entry.goals || "Empty entry"}</small>
                </button>
              )) : <p className={styles.empty}>Your saved entries will appear here.</p>}
            </div>
          </motion.aside>
        </div>
      </motion.main>
    </>
  );
}

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}
