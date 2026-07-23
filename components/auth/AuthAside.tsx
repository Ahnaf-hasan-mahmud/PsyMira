"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import GrowthTree from "@/components/illustrations/GrowthTree";
import ParticleField from "@/components/illustrations/ParticleField";
import { Star } from "@/components/ui/Icons";
import styles from "./AuthAside.module.css";

/**
 * The decorative left panel of the auth split layout — a calm purple
 * gradient with a breathing tree, motes and a soft testimonial.
 */
export default function AuthAside({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <aside className={styles.aside} aria-hidden="true">
      <ParticleField count={32} className={styles.particles} />
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <div className={styles.top}>
        <Logo href={null} />
      </div>

      <motion.div
        className={styles.center}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      >
        <GrowthTree level={5} size={240} />
        <h2 className={styles.headline}>
          A quiet place to
          <br />
          understand yourself.
        </h2>
        <p className={styles.copy}>
          Explore your emotions through gentle stories and watch your sanctuary
          grow.
        </p>
      </motion.div>

      <motion.figure
        className={styles.quoteCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className={styles.stars}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={13} />
          ))}
        </div>
        <blockquote>“{quote}”</blockquote>
        <figcaption>{author}</figcaption>
      </motion.figure>
    </aside>
  );
}
