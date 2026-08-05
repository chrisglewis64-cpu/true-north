"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AuthButton,
  AuthError,
  AuthField,
  AuthShell,
} from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";

export function ForgotPasswordPageContent() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    setMessage(undefined);

    const redirectTo = `${window.location.origin}/reset-password`;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo },
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setMessage("Check your email for a password reset link.");
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we will send a reset link."
      footer={
        <Link href="/login" className="text-foreground/80 hover:text-foreground">
          Back to log in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        {message ? (
          <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3 text-[14px] text-foreground/85">
            {message}
          </p>
        ) : null}
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthButton disabled={loading}>
          {loading ? "Sending…" : "Send Reset Link"}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
