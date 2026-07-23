"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { Book, Chart, Seed, Feather } from "@/components/ui/Icons";
import { fadeUp, fadeScale, stagger, viewportOnce } from "@/lib/motion";
import styles from "./Features.module.css";

const FEATURES = [
  {
    icon: Book,
    title: "Interactive Story Reflection",
    body: "Step into gentle, relatable stories and respond honestly. Each choice quietly mirrors a part of who you are.",
    tint: "lavender",
  },
  {
    icon: Chart,
    title: "Visual Progress Dashboard",
    body: "See your emotional patterns take shape through soft, beautiful charts — clarity without the clinical.",
    tint: "lilac",
  },
  {
    icon: Seed,
    title: "Personal Growth Journey",
    body: "Your sanctuary grows as you reflect. Watch a living tree bloom alongside your own quiet progress.",
    tint: "cream",
  },
  {
    icon: Feather,
    title: "Calm Journaling",
    body: "A still, unhurried space to write. No prompts demanded, no streak pressure — just you and the page.",
    tint: "purple",
  },
];

export default function Features() {
  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <Reveal className={styles.head}>
          <span className="eyebrow">Why PsyMira</span>
          <h2 className={styles.title}>
            A gentler way to meet <span className="gradient-text">yourself</span>
          </h2>
          <p className={styles.lede}>
            No questionnaires. No scores. Just an unhurried, beautiful path
            toward understanding your inner world.
          </p>
        </Reveal>

        <motion.div
          className={styles.grid}
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.article
                key={f.title}
                className={styles.card}
                variants={fadeScale}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <span className={`${styles.iconWrap} ${styles[f.tint]}`}>
                  <Icon size={24} />
                </span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardBody}>{f.body}</p>
                <span className={styles.glow} />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
