"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthButton,
  AuthError,
  AuthField,
  AuthShell,
} from "@/components/auth/AuthShell";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordPageContent() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(undefined);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Choose a new password for your account."
      footer={
        <Link href="/login" className="text-foreground/80 hover:text-foreground">
          Back to log in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthField
          id="password"
          label="New Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <AuthField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
        />
        <AuthButton disabled={loading}>
          {loading ? "Updating…" : "Update Password"}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
