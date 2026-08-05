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

export function LoginPageContent() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <AuthShell
      title="Log In"
      subtitle="Return to your standard."
      footer={
        <>
          <Link href="/signup" className="text-foreground/80 hover:text-foreground">
            Create an account
          </Link>
          {" · "}
          <Link
            href="/forgot-password"
            className="text-foreground/80 hover:text-foreground"
          >
            Forgot password
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />
        <AuthButton disabled={loading}>
          {loading ? "Signing in…" : "Log In"}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
