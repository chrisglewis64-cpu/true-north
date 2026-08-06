"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  calculateAlignment,
  type CalculateAlignmentResult,
} from "@/lib/compass/calculate-alignment";

/**
 * Resolves compass alignment from app state.
 * Recalculates automatically when debrief, intent, mission, or review data changes.
 */
export function useCompassAlignment(): CalculateAlignmentResult {
  const {
    dailyDebriefHistory,
    missionIntentHistory,
    currentMission,
    weeklyReviews,
  } = useTrueNorth();

  return useMemo(
    () =>
      calculateAlignment({
        dailyDebriefs: dailyDebriefHistory,
        missionIntents: missionIntentHistory,
        currentMission,
        weeklyReviews,
      }),
    [
      dailyDebriefHistory,
      missionIntentHistory,
      currentMission,
      weeklyReviews,
    ]
  );
}
