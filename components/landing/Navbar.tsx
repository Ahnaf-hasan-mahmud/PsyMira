"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { Menu, Close } from "@/components/ui/Icons";
import styles from "./Navbar.module.css";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Stories", href: "#stories" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "About", href: "#about" },
];

/**
 * Sticky transparent navbar that frosts into glass on scroll.
 * Collapses to a slide-down sheet on mobile.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <nav className={styles.nav} aria-label="Primary">
        <Logo />

        <ul className={styles.links}>
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className={styles.link}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <a href="/sign-in" className={styles.signin}>
            Sign In
          </a>
          <Button href="/sign-up" size="md">
            Get Started
          </Button>
        </div>

        <button
          className={styles.burger}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <Close /> : <Menu />}
        </button>
      </nav>

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
            <motion.div
              className={styles.sheet}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={styles.sheetLink}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className={styles.sheetActions}>
                <Button href="/sign-in" variant="secondary" fullWidth>
                  Sign In
                </Button>
                <Button href="/sign-up" fullWidth>
                  Get Started
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
