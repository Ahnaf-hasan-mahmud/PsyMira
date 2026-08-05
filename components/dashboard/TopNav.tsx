"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";
import GlobalSearch from "./GlobalSearch";
import styles from "./TopNav.module.css";

/** Dashboard top bar: greeting, search, notifications, avatar. */
export default function TopNav({ name = "Aria" }: { name?: string }) {
  const [displayName, setDisplayName] = useState(name);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    
    async function fetchName() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        if (profile.name) {
          setDisplayName(profile.name.charAt(0).toUpperCase() + profile.name.slice(1));
        } else {
          const fallback = (user.user_metadata?.name as string) || user.email?.split("@")[0] || name;
          setDisplayName(fallback.charAt(0).toUpperCase() + fallback.slice(1));
        }
        if (profile.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      } else {
        const fallback = (user.user_metadata?.name as string) || user.email?.split("@")[0] || name;
        setDisplayName(fallback.charAt(0).toUpperCase() + fallback.slice(1));
      }
    }
    
    fetchName();
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
        <div className={styles.searchWrap}>
          <GlobalSearch />
        </div>

        <NotificationDropdown />

        <Link href="/dashboard/profile" aria-label="Your profile">
          <button 
            className={styles.avatar} 
            tabIndex={-1}
            style={avatarUrl ? { padding: 0, overflow: 'hidden', background: 'transparent' } : {}}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initial
            )}
          </button>
        </Link>
      </div>
    </motion.header>
  );
}

