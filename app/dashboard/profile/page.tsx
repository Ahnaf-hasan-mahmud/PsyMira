"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import { Check } from "@/components/ui/Icons";
import styles from "./page.module.css";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      if (!supabase) {
        setName("Demo User");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from("profiles")
          .select("name, date_of_birth")
          .eq("id", user.id)
          .single();

        if (data) {
          if (data.name) setName(data.name);
          if (data.date_of_birth) setDob(data.date_of_birth);
        } else {
          setName(user.user_metadata?.name || user.email?.split("@")[0] || "User");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    const supabase = createClient();
    if (supabase && userId) {
      await supabase
        .from("profiles")
        .update({
          name: name,
          date_of_birth: dob || null
        })
        .eq("id", userId);
        
      // Update local window storage so TopNav can refresh immediately if we wanted to
      // (TopNav currently pulls from supabase auth, but we'll leave it as is for now)
    } else {
      // Demo delay
      await new Promise(r => setTimeout(r, 600));
    }
    
    setSaving(false);
  }

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>Loading profile...</div>;
  }

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>Your Profile</h1>
        <p className={styles.subtitle}>Manage your personal information and preferences.</p>
      </div>

      <GlassCard>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>{initial}</div>
        </div>

        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.field}>
            <label className={styles.label}>Display Name</label>
            <input 
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={e => setName(e.target.value)}
              placeholder="How should we call you?"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date of Birth (Optional)</label>
            <input 
              type="date" 
              className={styles.input} 
              value={dob} 
              onChange={e => setDob(e.target.value)}
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit" disabled={saving} iconLeft={saving ? undefined : <Check size={18} />}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
