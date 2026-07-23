"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type BaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

type Props = ButtonAsButton | ButtonAsLink;

type Ripple = { id: number; x: number; y: number };

/**
 * Premium button with subtle gradient fill and a soft ripple on press.
 * Renders an <a> (Next Link) when `href` is provided, otherwise a <button>.
 */
export default function Button(props: Props) {
  const {
    children,
    variant = "primary",
    size = "md",
    fullWidth,
    iconRight,
    iconLeft,
    className = "",
    ...rest
  } = props;

  const [ripples, setRipples] = useState<Ripple[]>([]);

  const spawnRipple = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      const id = Date.now();
      setRipples((r) => [
        ...r,
        { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
      ]);
      // clean up after the animation finishes
      window.setTimeout(
        () => setRipples((r) => r.filter((rp) => rp.id !== id)),
        650
      );
    },
    []
  );

  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {iconLeft && <span className={styles.icon}>{iconLeft}</span>}
      <span className={styles.label}>{children}</span>
      {iconRight && <span className={styles.icon}>{iconRight}</span>}
      <span className={styles.rippleLayer} aria-hidden="true">
        {ripples.map((r) => (
          <span
            key={r.id}
            className={styles.ripple}
            style={{ left: r.x, top: r.y }}
          />
        ))}
      </span>
    </>
  );

  // shared press feedback
  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  if ("href" in props && props.href) {
    return (
      <motion.span {...motionProps} className={styles.wrap}>
        <Link
          href={props.href}
          className={cls}
          onMouseDown={spawnRipple}
        >
          {inner}
        </Link>
      </motion.span>
    );
  }

  // `rest` carries native button attributes; their event-handler types
  // (onDrag etc.) overlap with Framer Motion's, so cast to satisfy both.
  const buttonRest = rest as Omit<HTMLMotionProps<"button">, "ref">;
  return (
    <motion.button
      {...motionProps}
      className={cls}
      onMouseDown={spawnRipple}
      {...buttonRest}
    >
      {inner}
    </motion.button>
  );
}
