"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  CREATE_ACCOUNT_PATH,
  ONBOARDING_PATH,
  SIGN_IN_PATH,
} from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const OPEN_PATHS = [
  SIGN_IN_PATH,
  CREATE_ACCOUNT_PATH,
  ONBOARDING_PATH,
  "/~offline",
] as const;

type OnboardingRouteGuardProps = {
  children: ReactNode;
};

/**
 * Authenticated users must finish onboarding before using the rest of the app.
 */
export function OnboardingRouteGuard({ children }: OnboardingRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding, session } = useTrueNorth();

  const isAuthenticated = session.id !== "session-local";
  const isOpenPath = OPEN_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const mustOnboard =
    isSupabaseConfigured() &&
    isAuthenticated &&
    !hasCompletedOnboarding &&
    !isOpenPath;

  useEffect(() => {
    if (mustOnboard) {
      router.replace(ONBOARDING_PATH);
    }
  }, [mustOnboard, router]);

  if (mustOnboard) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Continuing setup…
        </p>
      </div>
    );
  }

  return children;
}
