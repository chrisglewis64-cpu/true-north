"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { resolvePostAuthPath } from "@/lib/auth/post-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type AuthRedirectIfAuthenticatedProps = {
  children: ReactNode;
};

/**
 * Bypasses auth entry pages when a Supabase session already exists.
 */
export function AuthRedirectIfAuthenticated({
  children,
}: AuthRedirectIfAuthenticatedProps) {
  const router = useRouter();
  const [ready, setReady] = useState(!isSupabaseConfigured());

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    let cancelled = false;
    const supabase = createSupabaseBrowserClient();

    void supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) {
        return;
      }

      if (data.user) {
        const path = await resolvePostAuthPath(supabase, data.user.id);
        router.replace(path);
        return;
      }

      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Checking session…
        </p>
      </div>
    );
  }

  return children;
}
