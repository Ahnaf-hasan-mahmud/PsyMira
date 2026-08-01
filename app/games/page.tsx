"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { GAMES } from '@/lib/gamesData';
import { fadeUp, stagger, easeOut, viewportOnce } from '@/lib/motion';
import { Sparkle } from '@/components/ui/Icons';
import styles from './page.module.css';

export default function GamesHub() {
  return (
    <div className={styles.container}>
      <motion.header 
        className={styles.hero}
        variants={stagger(0.1)}
        initial="hidden"
        animate="show"
      >
        <div className={styles.glow} />
        
        <motion.div variants={fadeUp} className={styles.eyebrow}>
          <Sparkle size={16} />
          <span>Stress Relief Games</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className={styles.title}>
          Play without pressure.
        </motion.h1>

        <motion.p variants={fadeUp} className={styles.description}>
          Unwind with our collection of interactive experiences designed specifically for relaxation and stress relief.
        </motion.p>

        <motion.div variants={fadeUp} className={styles.metaContainer}>
          <span className={styles.metaPill}>No timers</span>
          <span className={styles.metaPill}>No scores</span>
          <span className={styles.metaPill}>Just calm</span>
        </motion.div>
      </motion.header>

      <motion.div 
        className={styles.grid}
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {GAMES.map((game) => (
          <Link href={game.href} key={game.id} className={styles.cardLink}>
            <motion.article 
              className={styles.card}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ ease: easeOut }}
            >
              <div 
                className={styles.cardAccent} 
                style={{ background: game.gradient || 'var(--accent)' }} 
              />
              <span className={styles.emoji}>{game.emoji}</span>
              <h2 className={styles.cardTitle}>{game.title}</h2>
              <p className={styles.cardDescription}>{game.description}</p>
              <span className={styles.playLink}>Play &rarr;</span>
            </motion.article>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
