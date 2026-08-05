"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/ui/Icons";
import { useActivityDashboard } from "@/lib/activityStore";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GlobalSearch.module.css";

const ROUTES = [
  { name: "Breathing Exercises", path: "/dashboard/breathing", icon: "🌬️", keywords: ["breathe", "breathing", "relax", "calm"] },
  { name: "Interactive Games", path: "/dashboard/games", icon: "🎮", keywords: ["game", "games", "play", "fun", "bubbles", "sand", "ripples"] },
  { name: "Stories & Reflections", path: "/dashboard/stories", icon: "📖", keywords: ["story", "stories", "read", "reflect"] },
  { name: "Mood Check-in", path: "/dashboard/mood", icon: "😊", keywords: ["mood", "feel", "checkin", "emotion"] },
  { name: "My Profile Dashboard", path: "/dashboard/profile", icon: "👤", keywords: ["profile", "stats", "xp", "streak", "goals", "history"] },
];

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { activities } = useActivityDashboard();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = query.toLowerCase().trim();

  // Filter routes
  const matchedRoutes = q ? ROUTES.filter(r => 
    r.name.toLowerCase().includes(q) || r.keywords.some(k => k.includes(q))
  ) : [];

  // Filter activities
  const matchedActivities = q ? activities.filter(a => {
    const text = `${a.title || ""} ${a.emotion || ""} ${a.kind} ${a.technique || ""}`.toLowerCase();
    return text.includes(q);
  }).slice(0, 4) : [];

  const hasResults = q.length > 0 && (matchedRoutes.length > 0 || matchedActivities.length > 0);
  const showDropdown = isFocused && q.length > 0;

  function handleNavigate(path: string) {
    setQuery("");
    setIsFocused(false);
    router.push(path);
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={`${styles.searchBox} ${isFocused ? styles.focused : ""}`}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Search stories, games, moods…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-label="Search"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {hasResults ? (
              <div className={styles.results}>
                {matchedRoutes.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>Pages & Features</div>
                    {matchedRoutes.map(route => (
                      <div key={route.path} className={styles.item} onClick={() => handleNavigate(route.path)}>
                        <span className={styles.icon}>{route.icon}</span>
                        <span>{route.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {matchedActivities.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionTitle}>Your Activity History</div>
                    {matchedActivities.map(act => (
                      <div key={act.id} className={styles.item} onClick={() => handleNavigate("/dashboard/profile")}>
                        <span className={styles.icon}>🕒</span>
                        <div className={styles.actInfo}>
                          <div className={styles.actTitle}>{act.title || (act.kind.charAt(0).toUpperCase() + act.kind.slice(1))}</div>
                          <div className={styles.actSub}>
                            {new Date(act.createdAt).toLocaleDateString()} • {act.emotion || act.technique || "Completed"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.empty}>
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
