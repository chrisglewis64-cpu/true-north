"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { useIdentityAlignment } from "@/hooks/useIdentityAlignment";
import { useEvidenceEntries } from "@/hooks/useEvidenceEntries";
import { getAlignmentFocus } from "@/lib/compass/alignment-focus";
import { getLocalDateString } from "@/lib/database/utils";

export function useAlignmentFocus() {
  const {
    todaysMissionIntent,
    dailyDebrief,
    currentMission,
    dailyDebriefHistory,
    missionIntentHistory,
  } = useTrueNorth();
  const { established, alignment } = useIdentityAlignment();
  const evidenceEntries = useEvidenceEntries();
  const today = getLocalDateString();

  return useMemo(() => {
    const evidenceCountToday = evidenceEntries.filter(
      (entry) => entry.debriefDate === today
    ).length;

    return getAlignmentFocus({
      established,
      alignment,
      todaysMissionIntent,
      todaysDebrief: dailyDebrief.submission,
      currentMission,
      dailyDebriefHistory,
      missionIntentHistory,
      evidenceCountToday,
    });
  }, [
    established,
    alignment,
    todaysMissionIntent,
    dailyDebrief.submission,
    currentMission,
    dailyDebriefHistory,
    missionIntentHistory,
    evidenceEntries,
    today,
  ]);
}
