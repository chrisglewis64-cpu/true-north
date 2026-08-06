"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { ONBOARDING_PATH, POST_AUTH_REDIRECT } from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type LandingGateProps = {
  children: React.ReactNode;
};

/**
 * Daily Morning Commitment gate on `/`.
 * - Incomplete onboarding → /onboarding
 * - Today's commit already done → Compass dashboard
 */
export function LandingGate({ children }: LandingGateProps) {
  const router = useRouter();
  const { hasCompletedMorningCommit, hasCompletedOnboarding, session } =
    useTrueNorth();

  const needsOnboarding =
    isSupabaseConfigured() &&
    session.id !== "session-local" &&
    !hasCompletedOnboarding;

  useEffect(() => {
    if (needsOnboarding) {
      router.replace(ONBOARDING_PATH);
      return;
    }
    if (hasCompletedMorningCommit) {
      router.replace(POST_AUTH_REDIRECT);
    }
  }, [hasCompletedMorningCommit, needsOnboarding, router]);

  if (needsOnboarding || hasCompletedMorningCommit) {
    return null;
  }

  return children;
}
