/* ============================================================
   Supabase configuration gate.
   The app runs fine WITHOUT keys (auth falls back to a demo
   stub); it only talks to a real database once these are set.
   ============================================================ */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Accept both the new "publishable" key name and the legacy "anon" name.
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True only when both keys look real (avoids crashing on placeholders). */
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith("http") &&
    SUPABASE_ANON_KEY.length > 20
);
