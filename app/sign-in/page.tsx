"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Logo from "@/components/ui/Logo";
import TextField from "@/components/auth/TextField";
import Checkbox from "@/components/auth/Checkbox";
import Button from "@/components/ui/Button";
import ParticleField from "@/components/illustrations/ParticleField";
import { Google, ArrowRight } from "@/components/ui/Icons";
import { fadeUp, stagger } from "@/lib/motion";
import form from "@/components/auth/AuthForm.module.css";
import styles from "./page.module.css";

type Errors = Partial<Record<"email" | "password", string>>;

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const e: Errors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (password.length < 1) e.password = "Please enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const supabase = createClient();

    // Demo fallback: no Supabase keys yet → simulate and enter the app.
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/dashboard");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({ password: "Incorrect email or password." });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogle() {
    const supabase = createClient();
    if (!supabase) {
      router.push("/dashboard");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <main className={styles.page}>
      {/* soft floating background */}
      <ParticleField count={40} className={styles.particles} />
      <motion.div
        className={`${styles.blob} ${styles.blobA}`}
        animate={{ y: [0, 26, 0], x: [0, 14, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.blob} ${styles.blobB}`}
        animate={{ y: [0, -24, 0], x: [0, -16, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.blob} ${styles.blobC}`}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className={form.panel}
          variants={stagger(0.08)}
          initial="hidden"
          animate="show"
        >
          <motion.div className={styles.logoRow} variants={fadeUp}>
            <Logo />
          </motion.div>

          <motion.div className={form.head} variants={fadeUp}>
            <h1 className={form.title}>Welcome back</h1>
            <p className={form.subtitle}>
              Your sanctuary has been waiting quietly for you.
            </p>
          </motion.div>

          <motion.form
            className={form.form}
            onSubmit={handleSubmit}
            variants={fadeUp}
            noValidate
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              error={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              error={errors.password}
            />

            <div className={form.row}>
              <Checkbox
                checked={remember}
                onChange={setRemember}
                label="Remember me"
              />
              <Link href="#" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={loading}
              iconRight={!loading ? <ArrowRight /> : undefined}
            >
              {loading ? "Opening your space…" : "Sign In"}
            </Button>
          </motion.form>

          <motion.div className={form.divider} variants={fadeUp}>
            <span>or</span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              iconLeft={<Google />}
              onClick={handleGoogle}
            >
              Continue with Google
            </Button>
          </motion.div>

          <motion.p className={form.foot} variants={fadeUp}>
            New to PsyMira?{" "}
            <Link href="/sign-up" className={form.footLink}>
              Create an account
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
}
