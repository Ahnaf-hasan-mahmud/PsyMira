"use client";

import { motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import ParticleField from "@/components/illustrations/ParticleField";
import { Star } from "@/components/ui/Icons";
import styles from "./AuthAside.module.css";

/**
 * Premium left panel with animated blobs, glassmorphism, 
 * and a soft testimonial.
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
      <ParticleField count={40} className={styles.particles} />
      
      {/* Animated Gradient Blobs */}
      <motion.div 
        className={styles.blob1} 
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className={styles.blob2} 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Soft glowing circles */}
      <div className={styles.glowCircle1} />
      <div className={styles.glowCircle2} />

      <div className={styles.content}>
        <div className={styles.top}>
          <Logo href={null} />
        </div>

        <motion.div
          className={styles.center}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <h2 className={styles.headline}>
            A quiet place to<br />
            understand yourself.
          </h2>
          <p className={styles.copy}>
            Explore your emotions through gentle stories and watch your sanctuary grow.
          </p>
        </motion.div>

        <motion.figure
          className={styles.quoteCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} />
            ))}
          </div>
          <blockquote>“{quote}”</blockquote>
          <figcaption>{author}</figcaption>
        </motion.figure>
      </div>
    </aside>
  );
}
