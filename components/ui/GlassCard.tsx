"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import styles from "./GlassCard.module.css";

type Props = HTMLMotionProps<"div"> & {
  /** glass = frosted translucent; solid = opaque white card */
  surface?: "glass" | "solid";
  /** add a gentle hover lift */
  interactive?: boolean;
  /** inner padding scale */
  pad?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

/**
 * Reusable surface for cards across the app.
 * `glass` leans on backdrop-blur; `solid` is the clean white card.
 */
const GlassCard = forwardRef<HTMLDivElement, Props>(function GlassCard(
  {
    surface = "solid",
    interactive = false,
    pad = "md",
    className = "",
    children,
    ...rest
  },
  ref
) {
  const cls = [
    styles.card,
    styles[surface],
    styles[`pad_${pad}`],
    interactive ? styles.interactive : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div ref={ref} className={cls} {...rest}>
      {children}
    </motion.div>
  );
});

export default GlassCard;
