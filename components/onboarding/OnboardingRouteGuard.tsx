"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  isAuthPublicPath,
  ONBOARDING_PATH,
  SIGN_IN_PATH,
} from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type OnboardingRouteGuardProps = {
  children: ReactNode;
};

/**
 * Client-side auth + onboarding gate.
 * - Unauthenticated → Sign In
 * - Authenticated but incomplete onboarding → /onboarding
 */
export function OnboardingRouteGuard({ children }: OnboardingRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding, session } = useTrueNorth();

  const supabaseEnabled = isSupabaseConfigured();
  const isAuthenticated = session.id !== "session-local";
  const isPublic = isAuthPublicPath(pathname);

  const mustSignIn = supabaseEnabled && !isAuthenticated && !isPublic;
  const mustOnboard =
    supabaseEnabled &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    pathname !== ONBOARDING_PATH &&
    !pathname.startsWith(`${ONBOARDING_PATH}/`) &&
    !isPublic;

  useEffect(() => {
    if (mustSignIn) {
      router.replace(SIGN_IN_PATH);
      return;
    }
    if (mustOnboard) {
      router.replace(ONBOARDING_PATH);
    }
  }, [mustOnboard, mustSignIn, router]);

  if (mustSignIn || mustOnboard) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {mustSignIn ? "Redirecting to Sign In…" : "Continuing setup…"}
        </p>
      </div>
    );
  }

  return children;
}
