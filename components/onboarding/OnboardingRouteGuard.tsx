"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  isAuthPublicPath,
  isMorningCommitPath,
  MORNING_COMMIT_PATH,
  SIGN_IN_PATH,
} from "@/lib/auth/paths";
import {
  isPathAllowedForStage,
  logOnboardingRedirect,
  pathForOnboardingStage,
  resolveOnboardingStage,
} from "@/lib/onboarding/stages";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type OnboardingRouteGuardProps = {
  children: ReactNode;
};

/**
 * Single onboarding / auth gate.
 * Redirects only when the current path is not allowed for the resolved stage.
 *
 * Stages: welcome → standards → mission → morning_commitment → complete
 */
export function OnboardingRouteGuard({ children }: OnboardingRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    hasCompletedMorningCommit,
    session,
  } = useTrueNorth();

  const supabaseEnabled = isSupabaseConfigured();
  const isAuthenticated = session.id !== "session-local";
  const isPublic = isAuthPublicPath(pathname);
  const stage = resolveOnboardingStage(session.onboarding);

  const mustSignIn = supabaseEnabled && !isAuthenticated && !isPublic;

  let redirectTarget: string | null = null;
  let redirectReason = "none";

  if (mustSignIn) {
    redirectTarget = SIGN_IN_PATH;
    redirectReason = "unauthenticated";
  } else if (supabaseEnabled && isAuthenticated && !isPublic) {
    if (!isPathAllowedForStage(pathname, stage)) {
      redirectTarget = pathForOnboardingStage(stage);
      redirectReason = `stage=${stage} disallows path=${pathname}`;
    } else if (
      stage === "complete" &&
      !hasCompletedMorningCommit &&
      !isMorningCommitPath(pathname)
    ) {
      redirectTarget = MORNING_COMMIT_PATH;
      redirectReason = "onboarding complete; morning commitment missing";
    }
  }

  useEffect(() => {
    if (!redirectTarget || redirectTarget === pathname) {
      return;
    }

    logOnboardingRedirect({
      userId: session.id,
      stage,
      pathname,
      target: redirectTarget,
      reason: redirectReason,
    });
    router.replace(redirectTarget);
  }, [
    pathname,
    redirectReason,
    redirectTarget,
    router,
    session.id,
    stage,
  ]);

  if (redirectTarget && redirectTarget !== pathname) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Continuing…
        </p>
      </div>
    );
  }

  return children;
}
