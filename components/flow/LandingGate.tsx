"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedMorningCommit } from "@/lib/morning-flow/commit-state";
import { useHydrated } from "@/hooks/useHydrated";

type LandingGateProps = {
  children: React.ReactNode;
};

/**
 * Skips landing and mission intent when the morning commit is already complete.
 */
export function LandingGate({ children }: LandingGateProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const shouldRedirect = hydrated && hasCompletedMorningCommit();

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/operations");
    }
  }, [router, shouldRedirect]);

  if (!hydrated || shouldRedirect) {
    return null;
  }

  return children;
}
