"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  calculateIdentityAlignment,
  type IdentityAlignmentResult,
} from "@/lib/identity-alignment";

/**
 * Resolves Identity Alignment from app state.
 * Recalculates when debrief, intent, or mission data changes.
 */
export function useIdentityAlignment(): IdentityAlignmentResult {
  const {
    dailyDebriefHistory,
    missionIntentHistory,
    currentMission,
  } = useTrueNorth();

  return useMemo(
    () =>
      calculateIdentityAlignment({
        dailyDebriefs: dailyDebriefHistory,
        missionIntents: missionIntentHistory,
        currentMission,
      }),
    [dailyDebriefHistory, missionIntentHistory, currentMission]
  );
}

/**
 * @deprecated Prefer useIdentityAlignment. Kept for gradual call-site migration.
 */
export function useCompassAlignment(): IdentityAlignmentResult {
  return useIdentityAlignment();
}
