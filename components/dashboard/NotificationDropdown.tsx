"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Bell } from "@/components/ui/Icons";
import styles from "./NotificationDropdown.module.css";

const NOTIFICATION_EVENT = "psymira:notification-new";

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load notifications
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      if (!supabase) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(15);

      if (data) setNotifications(data);
    }

    load();

    // Re-fetch whenever a new notification is pushed
    window.addEventListener(NOTIFICATION_EVENT, load);
    return () => window.removeEventListener(NOTIFICATION_EVENT, load);
  }, []);

  async function markAllRead() {
    if (!userId) return;
    const supabase = createClient();
    if (!supabase) return;

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  async function markRead(id: string) {
    const supabase = createClient();
    if (!supabase) return;

    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const getIcon = (title: string) => {
    if (title.includes("Streak")) return "🔥";
    if (title.includes("Badge") || title.includes("Achievement")) return "🏆";
    if (title.includes("Goal")) return "🎯";
    if (title.includes("XP")) return "⭐";
    if (title.includes("Breathing")) return "🌬️";
    if (title.includes("Story")) return "📖";
    return "✨";
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        className={styles.bellBtn}
        aria-label="Notifications"
        onClick={() => setOpen(prev => !prev)}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <div className={styles.header}>
              <span className={styles.headerTitle}>Notifications</span>
              {unreadCount > 0 && (
                <button className={styles.markAllBtn} onClick={markAllRead}>
                  Mark all read
                </button>
              )}
            </div>

            <div className={styles.list}>
              {notifications.length === 0 ? (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>🔔</span>
                  <p>You're all caught up!</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`${styles.item} ${!n.read ? styles.unread : ""}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className={styles.itemIcon}>{getIcon(n.title)}</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTitle}>{n.title}</div>
                      <div className={styles.itemBody}>{n.body}</div>
                      <div className={styles.itemTime}>{formatTime(n.created_at)}</div>
                    </div>
                    {!n.read && <div className={styles.dot} />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
