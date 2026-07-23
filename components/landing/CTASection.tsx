"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import ParticleField from "@/components/illustrations/ParticleField";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import styles from "./CTASection.module.css";

/** Final invitation band before the footer. */
export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.band}
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <ParticleField count={30} className={styles.particles} />
          <div className={styles.glowA} />
          <div className={styles.glowB} />

          <motion.h2 className={styles.title} variants={fadeUp}>
            Your quiet journey begins
            <br />
            with a single story.
          </motion.h2>
          <motion.p className={styles.sub} variants={fadeUp}>
            Free to start. No pressure, no scores — just a gentle place to
            understand yourself a little better, every day.
          </motion.p>
          <motion.div className={styles.actions} variants={fadeUp}>
            <Button
              href="/sign-up"
              size="lg"
              variant="secondary"
              iconRight={<ArrowRight />}
            >
              Start Journey
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
