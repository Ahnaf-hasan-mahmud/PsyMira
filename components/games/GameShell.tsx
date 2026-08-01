"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import styles from "./GameShell.module.css";

interface GameShellProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
  toolbar?: React.ReactNode;
}

export default function GameShell({ title, emoji, children, toolbar }: GameShellProps) {


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Link href="/games" className={styles.backLink}>
            ← Back to Games
          </Link>
          <h1 className={styles.title}>
            {emoji} {title}
          </h1>
        </div>

      </div>
      <div className={styles.canvasArea}>
        {children}
      </div>
      {toolbar && (
        <div className={styles.toolbar}>
          {toolbar}
        </div>
      )}
    </div>
  );
}
