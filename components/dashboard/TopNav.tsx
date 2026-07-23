"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Search, Bell } from "@/components/ui/Icons";
import styles from "./TopNav.module.css";

/** Dashboard top bar: greeting, search, notifications, avatar. */
export default function TopNav({ name = "Aria" }: { name?: string }) {
  const [displayName, setDisplayName] = useState(name);

  // Pull the signed-in user's name (falls back to the demo default).
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const n =
        (u.user_metadata?.name as string) ||
        u.email?.split("@")[0] ||
        name;
      setDisplayName(n.charAt(0).toUpperCase() + n.slice(1));
    });
  }, [name]);

  const hour = new Date().getHours();
  const part =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <motion.header
      className={styles.bar}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.greet}>
        <h1 className={styles.hello}>
          {part}, {displayName}
        </h1>
        <p className={styles.sub}>Here's how your inner world is unfolding.</p>
      </div>

      <div className={styles.actions}>
        <div className={styles.search}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search stories, reflections…"
            aria-label="Search"
          />
        </div>

        <button className={styles.iconBtn} aria-label="Notifications">
          <Bell size={20} />
          <span className={styles.badge} />
        </button>

        <button className={styles.avatar} aria-label="Your profile">
          {initial}
        </button>
      </div>
    </motion.header>
  );
}
