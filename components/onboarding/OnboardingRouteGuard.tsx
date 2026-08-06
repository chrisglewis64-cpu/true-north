"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  isAuthPublicPath,
  isMorningCommitPath,
  MORNING_COMMIT_PATH,
  ONBOARDING_PATH,
  SIGN_IN_PATH,
  WELCOME_PATH,
} from "@/lib/auth/paths";
import { hasSeenWelcome } from "@/lib/storage/welcome";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type OnboardingRouteGuardProps = {
  children: ReactNode;
};

/**
 * Client-side auth, welcome, onboarding, and daily commitment gates.
 * - Unauthenticated → Sign In
 * - First launch → /welcome (once)
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
  const [welcomeReady, setWelcomeReady] = useState(!supabaseEnabled);
  const [welcomeSeen, setWelcomeSeen] = useState(true);

  useEffect(() => {
    if (!supabaseEnabled || !isAuthenticated) {
      setWelcomeSeen(true);
      setWelcomeReady(true);
      return;
    }

    setWelcomeSeen(hasSeenWelcome(session.id));
    setWelcomeReady(true);
  }, [supabaseEnabled, isAuthenticated, session.id]);

  const isPublic = isAuthPublicPath(pathname);
  const onMorningCommit = isMorningCommitPath(pathname);
  const onWelcome = pathname === WELCOME_PATH;
  const onOnboarding =
    pathname === ONBOARDING_PATH || pathname.startsWith(`${ONBOARDING_PATH}/`);

  const mustSignIn = supabaseEnabled && !isAuthenticated && !isPublic;

  const mustWelcome =
    welcomeReady &&
    supabaseEnabled &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    !welcomeSeen &&
    !onWelcome &&
    !isPublic;

  const mustOnboard =
    welcomeReady &&
    supabaseEnabled &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    welcomeSeen &&
    !onOnboarding &&
    !onWelcome &&
    !isPublic;

  const mustCommit =
    supabaseEnabled &&
    isAuthenticated &&
    hasCompletedOnboarding &&
    !hasCompletedMorningCommit &&
    !onMorningCommit &&
    !onOnboarding &&
    !onWelcome &&
    !isPublic;

  useEffect(() => {
    if (mustSignIn) {
      router.replace(SIGN_IN_PATH);
      return;
    }
    if (mustWelcome) {
      router.replace(WELCOME_PATH);
      return;
    }
    if (mustOnboard) {
      router.replace(ONBOARDING_PATH);
      return;
    }
    if (mustCommit) {
      router.replace(MORNING_COMMIT_PATH);
    }
  }, [mustCommit, mustOnboard, mustSignIn, mustWelcome, router]);

  if (
    (supabaseEnabled && isAuthenticated && !welcomeReady) ||
    mustSignIn ||
    mustWelcome ||
    mustOnboard ||
    mustCommit
  ) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {mustSignIn
            ? "Redirecting to Sign In…"
            : mustWelcome
              ? "Preparing True North…"
              : mustOnboard
                ? "Continuing setup…"
                : mustCommit
                  ? "Opening Morning Commitment…"
                  : "Loading…"}
        </p>
      </div>
    );
  }

  return children;
}
