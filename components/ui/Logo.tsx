import Link from "next/link";
import styles from "./Logo.module.css";

type Props = {
  /** href to link to; pass null to render a non-link mark */
  href?: string | null;
  /** show the "PsyMira" wordmark next to the glyph */
  withWord?: boolean;
  /** glyph diameter in px */
  size?: number;
};

/**
 * PsyMira mark — a soft crescent "mirror" cradling a glowing seed.
 * Pure SVG so it scales crisply and themes via currentColor / gradient.
 */
export default function Logo({ href = "/", withWord = true, size = 34 }: Props) {
  const mark = (
    <span className={styles.row}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        className={styles.glyph}
      >
        <defs>
          <linearGradient id="psy-mark" x1="6" y1="6" x2="34" y2="34">
            <stop stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#8b6df0" />
          </linearGradient>
        </defs>
        {/* mirror crescent */}
        <path
          d="M20 3a17 17 0 1 0 0 34 13 13 0 0 1 0-34Z"
          fill="url(#psy-mark)"
        />
        {/* glowing seed */}
        <circle cx="24.5" cy="20" r="5.4" fill="#fff" opacity="0.92" />
        <circle cx="24.5" cy="20" r="2.6" fill="url(#psy-mark)" />
      </svg>
      {withWord && <span className={styles.word}>PsyMira</span>}
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className={styles.link} aria-label="PsyMira home">
      {mark}
    </Link>
  );
}
