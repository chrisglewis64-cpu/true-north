"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { buildEvidenceEntriesFromDebriefs } from "@/lib/evidence/build-evidence-entries";

/**
 * Chronological proof timeline — derived automatically from Daily Debriefs.
 * Never manually created, edited, or deleted.
 */
export function useEvidenceEntries() {
  const { dailyDebriefHistory, missionIntentHistory, currentMission } =
    useTrueNorth();

  return useMemo(
    () =>
      buildEvidenceEntriesFromDebriefs(
        dailyDebriefHistory,
        missionIntentHistory,
        currentMission?.name
      ),
    [dailyDebriefHistory, missionIntentHistory, currentMission?.name]
  );
}
