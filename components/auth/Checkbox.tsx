"use client";

import { Check } from "@/components/ui/Icons";
import styles from "./Checkbox.module.css";

export default function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className={styles.wrap}>
      <input
        type="checkbox"
        className={styles.native}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`${styles.box} ${checked ? styles.on : ""}`}>
        <Check size={13} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
