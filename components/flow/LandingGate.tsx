"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedMorningCommit } from "@/lib/morning-flow/commit-state";
import { useHydrated } from "@/hooks/useHydrated";
import { useApp } from "@/context/AppContext";

type LandingGateProps = {
  children: React.ReactNode;
};

export function LandingGate({ children }: LandingGateProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { isReady, morningCommitCompleted } = useApp();
  const committed = isReady ? morningCommitCompleted : hasCompletedMorningCommit();
  const shouldRedirect = hydrated && isReady && committed;

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/operations");
    }
  }, [router, shouldRedirect]);

  if (!hydrated || !isReady || shouldRedirect) {
    return null;
  }

  return children;
}
