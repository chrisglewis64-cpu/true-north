"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { POST_AUTH_REDIRECT } from "@/lib/auth/paths";
import {
  logOnboardingRedirect,
  pathForOnboardingStage,
  resolveOnboardingStage,
} from "@/lib/onboarding/stages";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type LandingGateProps = {
  children: React.ReactNode;
};

/**
 * Daily Morning Commitment gate on `/`.
 * Incomplete onboarding is sent to the next incomplete stage path.
 * Today's commit already done → Compass.
 */
export function LandingGate({ children }: LandingGateProps) {
  const router = useRouter();
  const { hasCompletedMorningCommit, session } = useTrueNorth();

  const stage = resolveOnboardingStage(session.onboarding);
  const needsOnboardingStage =
    isSupabaseConfigured() &&
    session.id !== "session-local" &&
    stage !== "complete";

  useEffect(() => {
    if (needsOnboardingStage) {
      const target = pathForOnboardingStage(stage);
      logOnboardingRedirect({
        userId: session.id,
        stage,
        pathname: "/",
        target,
        reason: "LandingGate — onboarding incomplete",
      });
      router.replace(target);
      return;
    }
    if (hasCompletedMorningCommit) {
      logOnboardingRedirect({
        userId: session.id,
        stage,
        pathname: "/",
        target: POST_AUTH_REDIRECT,
        reason: "LandingGate — morning commitment already complete",
      });
      router.replace(POST_AUTH_REDIRECT);
    }
  }, [hasCompletedMorningCommit, needsOnboardingStage, router, session.id, stage]);

  if (needsOnboardingStage || hasCompletedMorningCommit) {
    return null;
  }

  return children;
}
