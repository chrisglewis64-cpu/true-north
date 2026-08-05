"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedMorningCommit } from "@/lib/morning-flow/commit-state";
import { useHydrated } from "@/hooks/useHydrated";

type MorningFlowGuardProps = {
  children: React.ReactNode;
};

/**
 * Requires the morning commit before entering the main application.
 */
export function MorningFlowGuard({ children }: MorningFlowGuardProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const shouldRedirect = hydrated && !hasCompletedMorningCommit();

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/");
    }
  }, [router, shouldRedirect]);

  if (!hydrated || shouldRedirect) {
    return null;
  }

  return children;
}
