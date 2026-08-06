"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthRedirectIfAuthenticated } from "@/components/auth/AuthRedirectIfAuthenticated";
import { AuthShell } from "@/components/auth/AuthShell";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import {
  CREATE_ACCOUNT_PATH,
  POST_AUTH_REDIRECT,
} from "@/lib/auth/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSummary("Complete the required fields.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setSummary("Authentication is not configured for this environment.");
      return;
    }

    setErrors({});
    setSummary(undefined);
    setSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setSummary(error.message);
        setSubmitting(false);
        return;
      }

      router.replace(POST_AUTH_REDIRECT);
      router.refresh();
    } catch {
      setSummary("Unable to sign in. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <AuthRedirectIfAuthenticated>
      <AuthShell
        title="Sign in."
        subtitle="Return to your Standard. Continue where you left off."
      >
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          <ValidationSummary message={summary} />

          <label className="block" htmlFor="sign-in-email">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Email
            </span>
            <input
              id="sign-in-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.email))}`}
              placeholder="you@example.com"
            />
            <ValidationMessage message={errors.email} />
          </label>

          <label className="block" htmlFor="sign-in-password">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Password
            </span>
            <input
              id="sign-in-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.password))}`}
              placeholder="••••••••"
            />
            <ValidationMessage message={errors.password} />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-[15px] text-muted">
          New here?{" "}
          <Link
            href={CREATE_ACCOUNT_PATH}
            className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:decoration-muted"
          >
            Create an account
          </Link>
        </p>
      </AuthShell>
    </AuthRedirectIfAuthenticated>
  );
}
