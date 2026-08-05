"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";

type LandingGateProps = {
  children: React.ReactNode;
};

/**
 * Shows the Identity landing once per calendar day.
 * Skips to Operations when today's Commit flow is already complete.
 */
export function LandingGate({ children }: LandingGateProps) {
  const router = useRouter();
  const { hasCompletedMorningCommit } = useTrueNorth();

  useEffect(() => {
    if (hasCompletedMorningCommit) {
      router.replace("/operations");
    }
  }, [hasCompletedMorningCommit, router]);

  if (hasCompletedMorningCommit) {
    return null;
  }

  return children;
}
