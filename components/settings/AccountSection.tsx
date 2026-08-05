"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionCard";
import { AuthError, AuthField } from "@/components/auth/AuthShell";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

export function AccountSection() {
  const router = useRouter();
  const { signOut } = useAuth();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function handlePasswordChange() {
    setError(undefined);
    setMessage(undefined);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Password updated.");
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <section className="space-y-6">
      <div>
        <SectionLabel>Password</SectionLabel>
        <div className="mt-4 space-y-4">
          <AuthError message={error} />
          {message ? (
            <p className="text-[14px] text-foreground/80">{message}</p>
          ) : null}
          <AuthField
            id="settings-password"
            label="New Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />
          <AuthField
            id="settings-password-confirm"
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => void handlePasswordChange()}
            className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
          >
            {saving ? "Updating…" : "Change Password"}
          </button>
        </div>
      </div>

      <div>
        <SectionLabel>Account</SectionLabel>
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-xs uppercase tracking-[0.16em] text-foreground"
          >
            Sign Out
          </button>
          <button
            type="button"
            disabled
            className="flex h-12 w-full items-center justify-center rounded-2xl border border-border/60 bg-surface/60 font-mono text-xs uppercase tracking-[0.16em] text-muted"
          >
            Delete Account — Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}
