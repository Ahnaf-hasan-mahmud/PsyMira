/* ============================================================
   Shared Framer Motion variants — one calm rhythm everywhere.
   Gentle, slow, organic. No aggressive motion.
   ============================================================ */
import type { Variants, Transition } from "framer-motion";

export const easeOut = [0.16, 1, 0.3, 1] as const;

export const softSpring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 0.9,
};

/* Fade + rise — the default entrance for most blocks */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

/* Fade + scale — for cards and media */
export const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeOut },
  },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easeOut } },
};

/* Stagger container — reveals children in a soft sequence */
export const stagger = (gap = 0.1, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/* Viewport config so sections animate once as they enter */
export const viewportOnce = { once: true, amount: 0.3 } as const;
