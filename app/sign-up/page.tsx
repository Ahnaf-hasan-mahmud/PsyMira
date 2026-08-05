"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import AuthAside from "@/components/auth/AuthAside";
import TextField from "@/components/auth/TextField";
import PasswordStrength from "@/components/auth/PasswordStrength";
import Button from "@/components/ui/Button";
import { Google, ArrowRight, Lock } from "@/components/ui/Icons";
import { fadeUp, stagger } from "@/lib/motion";
import form from "@/components/auth/AuthForm.module.css";
import styles from "./page.module.css";

const INTEREST_OPTIONS = [
  "Reading", "Coding", "Gaming", "Music", "Photography", 
  "Meditation", "Movies", "Exercise", "Travel", "Cooking", "Art"
];

const OCCUPATION_OPTIONS = [
  { id: "student", label: "Student", icon: "🎓" },
  { id: "professional", label: "Professional", icon: "💼" },
  { id: "freelancer", label: "Freelancer", icon: "💻" },
  { id: "healthcare", label: "Healthcare", icon: "🏥" },
  { id: "creative", label: "Creative", icon: "🎨" },
  { id: "teacher", label: "Teacher", icon: "📚" },
  { id: "other", label: "Other", icon: "✨" },
];

export default function SignUpPage() {
  const router = useRouter();
  
  // Step state
  const [step, setStep] = useState(1);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  
  const [bio, setBio] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  function validateStep(currentStep: number): boolean {
    const e: Record<string, string> = {};
    if (currentStep === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email.";
      if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        e.password = "Password does not meet requirements.";
      }
      if (confirm !== password) e.confirm = "Passwords don't match.";
    } else if (currentStep === 2) {
      if (name.trim().length < 2) e.name = "Please tell us your name.";
      if (username.trim().length < 3) e.username = "Username must be at least 3 characters.";
      if (!dob) e.dob = "Please tell us your date of birth.";
      if (!gender) e.gender = "Please select a gender.";
    } else if (currentStep === 3) {
      if (!agreeToTerms) e.terms = "You must agree to the Terms and Rules.";
    }
    setErrors(e);
    if (Object.keys(e).length > 0) window.scrollTo({ top: 0, behavior: "smooth" });
    return Object.keys(e).length === 0;
  }

  async function handleNext() {
    if (!validateStep(step)) return;

    if (step === 2 && username.trim().length > 0) {
      setLoading(true);
      const supabase = createClient();
      if (supabase) {
        const { data: isAvailable, error: rpcError } = await supabase.rpc('check_username_available', {
          check_username: username.trim()
        });
        if (isAvailable === false) {
          setErrors({ username: "This username is already taken." });
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    }

    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    setErrors({});
    setStep(prev => prev - 1);
  }

  function toggleInterest(opt: string) {
    if (interests.includes(opt)) {
      setInterests(prev => prev.filter(x => x !== opt));
    } else if (interests.length < 5) {
      setInterests(prev => [...prev, opt]);
    }
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);
    setNotice("");

    const supabase = createClient();
    if (!supabase) {
      await new Promise((r) => setTimeout(r, 1100));
      router.push("/dashboard");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, dob, username, bio, occupation, gender, phone_number: phone, interests },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrors({ submit: error.message });
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

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
    if (supabase) {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.split}>
        <AuthAside
          quote="Signing up felt like being handed a soft, quiet notebook that already understood me."
          author="Aria M. · PsyMira member"
        />

        <div className={styles.formPanel}>
          <div className={styles.formContainer}>
            
            {/* Progress Indicator */}
            <div className={styles.progressWrap}>
              <div className={styles.progressText}>Step {step} of 3</div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill} 
                  initial={{ width: "33%" }}
                  animate={{ width: `${(step / 3) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            <motion.div className={form.head} variants={fadeUp} initial="hidden" animate="show">
              <h1 className={form.title}>
                {step === 1 && "Create your sanctuary"}
                {step === 2 && "Personal Information"}
                {step === 3 && "Personalization"}
              </h1>
              <p className={form.subtitle}>
                {step === 1 && "Let's start with the basics to secure your account."}
                {step === 2 && "Tell us a bit about yourself."}
                {step === 3 && "Tailor your experience (Optional)."}
              </p>
            </motion.div>

            <form className={form.form} onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} noValidate>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <TextField label="Email" type="email" value={email} onChange={setEmail} error={errors.email} required />
                    
                    <TextField label="Password" type="password" value={password} onChange={setPassword} error={errors.password} required />
                    <PasswordStrength password={password} />
                    
                    <TextField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} error={errors.confirm} required />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <TextField label="Full Name" value={name} onChange={setName} error={errors.name} required />
                      <TextField label="Username" value={username} onChange={setUsername} error={errors.username} required />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px', marginBottom: '24px' }}>
                      <TextField label="Date of Birth" type="date" value={dob} onChange={setDob} error={errors.dob} required />
                      
                      <div className={styles.selectWrap}>
                        <label className={styles.selectLabel}>Gender *</label>
                        <select className={styles.select} value={gender} onChange={e => setGender(e.target.value)}>
                          <option value="" disabled>Select gender...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        {errors.gender && <p className={styles.errorText}>{errors.gender}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                    
                    <div style={{ marginBottom: "28px" }}>
                      <label className={styles.sectionLabel}>Interests (Max 5)</label>
                      <div className={styles.chipGrid}>
                        {INTEREST_OPTIONS.map(opt => {
                          const selected = interests.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
                              onClick={() => toggleInterest(opt)}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ marginBottom: "28px" }}>
                      <label className={styles.sectionLabel}>Occupation</label>
                      <div className={styles.cardGrid}>
                        {OCCUPATION_OPTIONS.map(opt => {
                          const selected = occupation === opt.label;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              className={`${styles.occCard} ${selected ? styles.occSelected : ""}`}
                              onClick={() => setOccupation(selected ? "" : opt.label)}
                            >
                              <span className={styles.occIcon}>{opt.icon}</span>
                              <span className={styles.occText}>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <TextField label="Short Bio (Optional)" value={bio} onChange={setBio} />
                      <TextField label="Phone Number" type="tel" value={phone} onChange={setPhone} />
                    </div>

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '14px', cursor: 'pointer', marginBottom: '24px', color: 'var(--text-secondary)' }}>
                      <input 
                        type="checkbox" 
                        checked={agreeToTerms} 
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        style={{ accentColor: 'var(--accent)', width: '18px', height: '18px', cursor: 'pointer', marginTop: '2px' }}
                      />
                      <span style={{ lineHeight: '1.4' }}>
                        I agree to the <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="#" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Community Rules</Link>.
                      </span>
                    </label>

                    {errors.terms && <p style={{ color: "var(--danger)", fontSize: "14px", marginBottom: "16px" }}>{errors.terms}</p>}
                    {errors.submit && <p style={{ color: "var(--danger)", fontSize: "14px", marginBottom: "16px" }}>{errors.submit}</p>}
                    {notice && <p style={{ color: "var(--accent)", fontSize: "14px", marginBottom: "16px" }}>{notice}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.actionsRow}>
                {step > 1 && (
                  <Button type="button" variant="secondary" size="lg" onClick={handleBack} disabled={loading} style={{ width: '120px' }}>
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button type="button" size="lg" onClick={handleNext} disabled={loading} style={{ flex: 1 }} iconRight={<ArrowRight />}>
                    {loading ? "Checking..." : "Continue"}
                  </Button>
                ) : (
                  <Button type="submit" size="lg" disabled={loading} style={{ flex: 1 }} iconRight={!loading ? <ArrowRight /> : undefined}>
                    {loading ? "Creating account…" : "Complete Registration"}
                  </Button>
                )}
              </div>
            </form>

            {step === 1 && (
              <>
                <motion.div className={form.divider} variants={fadeUp} initial="hidden" animate="show" style={{ marginTop: '32px' }}>
                  <span>or</span>
                </motion.div>

                <motion.div variants={fadeUp} initial="hidden" animate="show">
                  <Button type="button" variant="secondary" size="lg" fullWidth iconLeft={<Google />} onClick={handleGoogle}>
                    Continue with Google
                  </Button>
                </motion.div>
              </>
            )}

            <div className={styles.trustSection}>
              <Lock size={14} />
              <p>Your information is encrypted and securely stored. Your data will never be shared without your permission.</p>
            </div>

            <p className={form.foot} style={{ marginTop: "32px", textAlign: "center" }}>
              Already have an account?{" "}
              <Link href="/sign-in" className={form.footLink}>
                Sign In
              </Link>
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}
