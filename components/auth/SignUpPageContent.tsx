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

export function SignUpPageContent() {
  const router = useRouter();
  const supabase = createClient();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName.trim(),
          timezone,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <AuthShell
      title="Sign Up"
      subtitle="Begin defining the standard you intend to live by."
      footer={
        <Link href="/login" className="text-foreground/80 hover:text-foreground">
          Already have an account? Log in
        </Link>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <AuthError message={error} />
        <AuthField
          id="displayName"
          label="Display Name"
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <AuthButton disabled={loading}>
          {loading ? "Creating account…" : "Sign Up"}
        </AuthButton>
      </form>
    </AuthShell>
  );
}
