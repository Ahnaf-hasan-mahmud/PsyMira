"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { Star } from "@/components/ui/Icons";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import styles from "./Testimonials.module.css";

const QUOTES = [
  {
    quote:
      "It doesn't feel like an app. It feels like a quiet room I get to return to. The stories say things I couldn't put into words.",
    name: "Aria M.",
    role: "Joined 4 months ago",
    tint: "#a78bfa",
  },
  {
    quote:
      "No scores, no judgement. Watching my little tree grow somehow makes reflecting feel safe — even on the heavy days.",
    name: "Devon K.",
    role: "Joined 7 months ago",
    tint: "#c4b5fd",
  },
  {
    quote:
      "I've tried every mood tracker. PsyMira is the first one that felt like it was made by someone who actually cares.",
    name: "Sofia L.",
    role: "Joined 2 months ago",
    tint: "#ecd9c4",
  },
];

export default function Testimonials() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Quiet voices</span>
          <h2 className={styles.title}>
            Gentle words from <span className="gradient-text">gentle minds</span>
          </h2>
        </Reveal>

        <motion.div
          className={styles.grid}
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {QUOTES.map((q) => (
            <motion.figure
              key={q.name}
              className={styles.card}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <div className={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} />
                ))}
              </div>
              <blockquote className={styles.quote}>“{q.quote}”</blockquote>
              <figcaption className={styles.person}>
                <span
                  className={styles.avatar}
                  style={{ background: q.tint }}
                >
                  {q.name.charAt(0)}
                </span>
                <span>
                  <span className={styles.name}>{q.name}</span>
                  <span className={styles.role}>{q.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
