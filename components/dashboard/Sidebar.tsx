"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import {
  Grid,
  Book,
  Wind,
  Waves,
  Feather,
  Compass,
  Logout,
  Menu,
  Close,
} from "@/components/ui/Icons";
import styles from "./Sidebar.module.css";

const NAV = [
  { label: "Dashboard", icon: Grid, href: "/dashboard" },
  { label: "Stories", icon: Book, href: "/story" },
  { label: "Breathing", icon: Wind, href: "/breathing" },
  { label: "Relaxation", icon: Waves, href: "/relaxation" },
  { label: "Journal", icon: Feather, href: "/dashboard/journal" },
  { label: "Insights", icon: Compass, href: "/dashboard/insights" },
];

/**
 * Modern dashboard sidebar. Fixed rail on desktop; slides in as a
 * sheet on mobile via the floating menu button.
 */
export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();
    if (supabase) await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const nav = (
    <nav className={styles.nav} aria-label="Dashboard">
      <div className={styles.logoWrap}>
        <Logo />
      </div>

      <ul className={styles.list}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href !== "#" && pathname
              ? pathname === item.href || pathname.startsWith(`${item.href}/`)
              : false;
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`${styles.item} ${active ? styles.active : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className={styles.itemIcon}>
                  <Icon size={20} />
                </span>
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className={styles.pill}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.bottom}>
        <div className={styles.upsell}>
          <span className={styles.upsellTitle}>Keep growing 🌙</span>
          <p className={styles.upsellBody}>
            You're on a 5-day streak. A new story unlocks tomorrow.
          </p>
        </div>
        <button
          type="button"
          className={styles.logout}
          onClick={handleLogout}
        >
          <Logout size={19} />
          Logout
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* mobile trigger */}
      <button
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      {/* desktop rail */}
      <aside className={styles.rail}>{nav}</aside>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className={styles.scrim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className={styles.sheet}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <button
                className={styles.close}
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <Close size={20} />
              </button>
              {nav}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
