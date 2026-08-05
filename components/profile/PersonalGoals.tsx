"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Check, Plus } from "@/components/ui/Icons";
import styles from "./PersonalGoals.module.css";

type Goal = {
  id: string;
  title: string;
  target: number;
  progress: number;
  completed: boolean;
};

export default function PersonalGoals({ userId }: { userId: string | null }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    async function fetchGoals() {
      if (!userId) return;
      const supabase = createClient();
      if (!supabase) return;
      
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
        
      if (data) setGoals(data);
      setLoading(false);
    }
    fetchGoals();
  }, [userId]);

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!newGoal.trim() || !userId) return;
    
    const supabase = createClient();
    if (!supabase) return;

    const { data } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        title: newGoal.trim(),
        target: 1,
        progress: 0,
        completed: false
      })
      .select()
      .single();

    if (data) {
      setGoals([...goals, data]);
      setNewGoal("");
    }
  }

  async function toggleGoal(id: string, currentCompleted: boolean) {
    const supabase = createClient();
    if (!supabase) return;

    const nextCompleted = !currentCompleted;
    setGoals(goals.map(g => g.id === id ? { ...g, completed: nextCompleted, progress: nextCompleted ? g.target : 0 } : g));

    await supabase
      .from("goals")
      .update({ completed: nextCompleted, progress: nextCompleted ? 1 : 0 })
      .eq("id", id);
  }

  async function deleteGoal(id: string) {
    const supabase = createClient();
    if (!supabase) return;

    setGoals(goals.filter(g => g.id !== id));
    await supabase.from("goals").delete().eq("id", id);
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Personal Goals</h2>
      <GlassCard className={styles.card}>
        <form className={styles.addForm} onSubmit={handleAddGoal}>
          <input 
            type="text" 
            className={styles.input} 
            placeholder="e.g. Meditate for 10 minutes"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
          />
          <Button type="submit" variant="secondary" iconLeft={<Plus size={16} />}>Add</Button>
        </form>

        {loading ? (
          <div className={styles.empty}>Loading goals...</div>
        ) : goals.length === 0 ? (
          <div className={styles.empty}>No goals set yet. Start small!</div>
        ) : (
          <ul className={styles.list}>
            {goals.map(goal => (
              <li key={goal.id} className={`${styles.item} ${goal.completed ? styles.completed : ""}`}>
                <button 
                  className={styles.checkBtn} 
                  onClick={() => toggleGoal(goal.id, goal.completed)}
                  aria-label={goal.completed ? "Mark incomplete" : "Mark complete"}
                >
                  {goal.completed ? <Check size={16} /> : null}
                </button>
                <span className={styles.goalTitle}>{goal.title}</span>
                <button className={styles.deleteBtn} onClick={() => deleteGoal(goal.id)}>✕</button>
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  );
}
