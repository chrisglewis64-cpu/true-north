"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { buildEvidenceEntriesFromDebriefs } from "@/lib/evidence/build-evidence-entries";

export function useEvidenceEntries() {
  const { dailyDebriefHistory, missionIntentHistory } = useTrueNorth();

  return useMemo(
    () =>
      buildEvidenceEntriesFromDebriefs(
        dailyDebriefHistory,
        missionIntentHistory
      ),
    [dailyDebriefHistory, missionIntentHistory]
  );
}
