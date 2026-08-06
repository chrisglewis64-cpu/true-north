"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  isAuthPublicPath,
  isMorningCommitPath,
  MORNING_COMMIT_PATH,
  ONBOARDING_PATH,
  SIGN_IN_PATH,
} from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type OnboardingRouteGuardProps = {
  children: ReactNode;
};

/**
 * Client-side auth, onboarding, and daily commitment gates.
 * - Unauthenticated → Sign In
 * - Incomplete onboarding → /onboarding
 * - Missing today's Morning Commitment → /
 */
export function OnboardingRouteGuard({ children }: OnboardingRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    hasCompletedMorningCommit,
    hasCompletedOnboarding,
    session,
  } = useTrueNorth();

  const supabaseEnabled = isSupabaseConfigured();
  const isAuthenticated = session.id !== "session-local";
  const isPublic = isAuthPublicPath(pathname);
  const onMorningCommit = isMorningCommitPath(pathname);
  const onOnboarding =
    pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);

  const mustSignIn = supabaseEnabled && !isAuthenticated && !isPublic;

  const mustOnboard =
    supabaseEnabled &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    !onOnboarding &&
    !isPublic;

  const mustCommit =
    supabaseEnabled &&
    isAuthenticated &&
    hasCompletedOnboarding &&
    !hasCompletedMorningCommit &&
    !onMorningCommit &&
    !onOnboarding &&
    !isPublic;

  useEffect(() => {
    if (mustSignIn) {
      router.replace(SIGN_IN_PATH);
      return;
    }
    if (mustOnboard) {
      router.replace(ONBOARDING_PATH);
      return;
    }
    if (mustCommit) {
      router.replace(MORNING_COMMIT_PATH);
    }
  }, [mustCommit, mustOnboard, mustSignIn, router]);

  if (mustSignIn || mustOnboard || mustCommit) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {mustSignIn
            ? "Redirecting to Sign In…"
            : mustOnboard
              ? "Continuing setup…"
              : "Opening Morning Commitment…"}
        </p>
      </div>
    );
  }

  return children;
}
