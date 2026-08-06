/**
 * Public Supabase configuration.
 *
 * NEXT_PUBLIC_* values must be referenced as full literal expressions so Next.js
 * can inline them into the client bundle. Do not alias `process.env` or look up
 * keys dynamically — that leaves the browser with undefined values.
 */

const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const NEXT_PUBLIC_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns true when Supabase public env vars are present.
 * When false, the app falls back to in-memory React Context state.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    NEXT_PUBLIC_SUPABASE_URL?.trim() && NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabaseUrl(): string {
  const url = NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  const key = NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return key;
}
