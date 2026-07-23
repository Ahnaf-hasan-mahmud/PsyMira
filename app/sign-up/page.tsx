"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import AuthAside from "@/components/auth/AuthAside";
import TextField from "@/components/auth/TextField";
import Button from "@/components/ui/Button";
import { Google, ArrowRight } from "@/components/ui/Icons";
import { fadeUp, stagger } from "@/lib/motion";
import form from "@/components/auth/AuthForm.module.css";
import styles from "./page.module.css";

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  function validate(): boolean {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Please tell us your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email address.";
    if (password.length < 8) e.password = "Use at least 8 characters.";
    if (confirm !== password) e.confirm = "Passwords don't match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setNotice("");

    const supabase = createClient();

    // Demo fallback: no Supabase keys yet → simulate and enter the app.
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 1100));
      router.push("/dashboard");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrors({ email: error.message });
      setLoading(false);
      return;
    }

    // If email confirmation is enabled, there's no session yet.
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setNotice("Almost there — check your inbox to confirm your email.");
      setLoading(false);
    }
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
      <div className={styles.split}>
        <AuthAside
          quote="Signing up felt like being handed a soft, quiet notebook that already understood me."
          author="Aria M. · PsyMira member"
        />

        <motion.div
          className={form.panel}
          variants={stagger(0.08)}
          initial="hidden"
          animate="show"
        >
          <motion.div className={form.head} variants={fadeUp}>
            <h1 className={form.title}>Create your sanctuary</h1>
            <p className={form.subtitle}>
              Begin your gentle journey inward. It's free to start.
            </p>
          </motion.div>

          <motion.form
            className={form.form}
            onSubmit={handleSubmit}
            variants={fadeUp}
            noValidate
          >
            <TextField
              label="Name"
              value={name}
              onChange={setName}
              autoComplete="name"
              error={errors.name}
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              error={errors.email}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              error={errors.password}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              error={errors.confirm}
              required
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={loading}
              iconRight={!loading ? <ArrowRight /> : undefined}
            >
              {loading ? "Creating your space…" : "Create Account"}
            </Button>
          </motion.form>

          <motion.div className={form.divider} variants={fadeUp}>
            <span>or</span>
          </motion.div>

          {notice && (
            <motion.p
              className={form.notice}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
            >
              {notice}
            </motion.p>
          )}

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
            Already have an account?{" "}
            <Link href="/sign-in" className={form.footLink}>
              Sign In
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
