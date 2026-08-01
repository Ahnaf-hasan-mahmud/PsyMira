"use client";

import { useState, useId } from "react";
import { Eye, EyeOff } from "@/components/ui/Icons";
import styles from "./TextField.module.css";

type Props = {
  label: string;
  type?: "text" | "email" | "password" | "date";
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
};

/**
 * Floating-label input with built-in password reveal and inline error.
 * Label lifts on focus or when filled — keeps the form airy.
 *
 * The floating behavior is driven entirely by the `active` boolean
 * which toggles the `.lifted` CSS class. This is reliable because:
 *  - `value` is controlled by React state (always in sync)
 *  - `focused` is tracked via onFocus/onBlur
 *  - `type === "date"` always has visible browser chrome
 *  - Browser autofill fires onChange on interaction, updating value
 */
export default function TextField({
  label,
  type = "text",
  value,
  onChange,
  autoComplete,
  error,
  icon,
  required,
}: Props) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (reveal ? "text" : "password") : type;

  // Label should float when:
  //  1. The input is focused
  //  2. The input has a value
  //  3. The input is type="date" (browser always shows placeholder chrome)
  const active = focused || value.length > 0 || type === "date";

  return (
    <div className={styles.field}>
      <div
        className={`${styles.box} ${focused ? styles.focused : ""} ${
          error ? styles.invalid : ""
        }`}
      >
        {icon && <span className={styles.leadIcon}>{icon}</span>}
        <div className={styles.inputWrap}>
          <label
            htmlFor={id}
            className={`${styles.label} ${active ? styles.lifted : ""} ${
              icon ? styles.labelWithIcon : ""
            }`}
          >
            {label}
            {required && <span className={styles.req}>*</span>}
          </label>
          <input
            id={id}
            type={inputType}
            className={styles.input}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-err` : undefined}
          />
        </div>
        {isPassword && (
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
