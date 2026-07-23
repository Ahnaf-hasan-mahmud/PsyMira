"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import HeroScene from "@/components/illustrations/HeroScene";
import { ArrowRight, Play, Sparkle, Star } from "@/components/ui/Icons";
import { fadeUp, stagger } from "@/lib/motion";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* soft backdrop blobs */}
      <div className={`${styles.blob} ${styles.blobA}`} />
      <div className={`${styles.blob} ${styles.blobB}`} />

      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          variants={stagger(0.12)}
          initial="hidden"
          animate="show"
        >
          <motion.span className={styles.badge} variants={fadeUp}>
            <Sparkle size={15} />
            A quiet space for your mind
          </motion.span>

          <motion.h1 className={styles.headline} variants={fadeUp}>
            Understand yourself,
            <br />
            one <span className="gradient-text">story</span> at a time.
          </motion.h1>

          <motion.p className={styles.sub} variants={fadeUp}>
            Discover your emotional patterns through immersive stories — and
            watch your personal sanctuary grow, gently, with every reflection.
          </motion.p>

          <motion.div className={styles.cta} variants={fadeUp}>
            <Button href="/sign-up" size="lg" iconRight={<ArrowRight />}>
              Start Journey
            </Button>
            <Button
              href="/story"
              size="lg"
              variant="secondary"
              iconLeft={<Play size={16} />}
            >
              Explore Demo
            </Button>
          </motion.div>

          <motion.div className={styles.proof} variants={fadeUp}>
            <div className={styles.avatars}>
              {AVATARS.map((c, i) => (
                <span
                  key={i}
                  className={styles.avatar}
                  style={{ background: c }}
                />
              ))}
            </div>
            <div className={styles.proofText}>
              <span className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} />
                ))}
              </span>
              <span>
                Loved by <strong>12,000+</strong> quiet minds
              </span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.art}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <HeroScene />
        </motion.div>
      </div>
    </section>
  );
}

const AVATARS = ["#c4b5fd", "#a78bfa", "#ddd6fe", "#ecd9c4", "#b9a7e8"];
