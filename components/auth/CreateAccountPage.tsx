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
import { ONBOARDING_PATH, SIGN_IN_PATH } from "@/lib/auth/paths";
import { upsertProfile } from "@/lib/database/profiles.repository";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type FieldErrors = {
  displayName?: string;
  email?: string;
  password?: string;
};

export function CreateAccountPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [summary, setSummary] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!displayName.trim()) {
      nextErrors.displayName = "Enter a display name.";
    }
    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    }
    if (!password) {
      nextErrors.password = "Choose a password.";
    } else if (password.length < 6) {
      nextErrors.password = "Use at least 6 characters.";
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

    const trimmedName = displayName.trim();
    const trimmedEmail = email.trim();

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            display_name: trimmedName,
          },
        },
      });

      if (error) {
        setSummary(error.message);
        setSubmitting(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setSummary("Account could not be created. Try again.");
        setSubmitting(false);
        return;
      }

      // Profile is also created by the auth trigger; upsert covers both paths.
      if (data.session) {
        try {
          await upsertProfile(supabase, user.id, trimmedName, trimmedEmail);
        } catch {
          // Trigger may already have created the row; continue into the app.
        }

        router.replace(ONBOARDING_PATH);
        router.refresh();
        return;
      }

      // Email confirmation enabled — no session until verified.
      setNeedsEmailVerification(true);
      setSubmitting(false);
    } catch {
      setSummary("Unable to create your account. Try again.");
      setSubmitting(false);
    }
  }

  if (needsEmailVerification) {
    return (
      <AuthShell
        title="Verify your email."
        subtitle="Check your inbox to confirm your account, then sign in to continue."
      >
        <div className="rounded-2xl border border-border bg-surface px-5 py-6 sm:px-6">
          <p className="text-[15px] leading-relaxed text-muted">
            We sent a verification link to{" "}
            <span className="text-foreground">{email.trim()}</span>.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            Once confirmed, return here and sign in.
          </p>
        </div>

        <Link
          href={SIGN_IN_PATH}
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
        >
          Go to Sign In
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthRedirectIfAuthenticated>
      <AuthShell
        title="Create account."
        subtitle="Create your account, then set up your Standard and Mission."
      >
        <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
          <ValidationSummary message={summary} />

          <label className="block" htmlFor="create-display-name">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Display Name
            </span>
            <input
              id="create-display-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              aria-invalid={Boolean(errors.displayName)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.displayName))}`}
              placeholder="How you are known"
            />
            <ValidationMessage message={errors.displayName} />
          </label>

          <label className="block" htmlFor="create-email">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Email
            </span>
            <input
              id="create-email"
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

          <label className="block" htmlFor="create-password">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Password
            </span>
            <input
              id="create-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.password))}`}
              placeholder="At least 6 characters"
            />
            <ValidationMessage message={errors.password} />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
          >
            {submitting ? "Creating…" : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-[15px] text-muted">
          Already have an account?{" "}
          <Link
            href={SIGN_IN_PATH}
            className="text-foreground underline decoration-border-subtle underline-offset-4 transition-colors hover:decoration-muted"
          >
            Sign in
          </Link>
        </p>
      </AuthShell>
    </AuthRedirectIfAuthenticated>
  );
}
