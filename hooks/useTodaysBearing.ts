"use client";

import { useMemo } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";
import { useEvidenceEntries } from "@/hooks/useEvidenceEntries";
import { recommendTodaysBearing } from "@/lib/bearings/recommend";
import { resolveBearings } from "@/lib/bearings/library";

export function useTodaysBearing() {
  const { weeklyBearings, dailyDebriefHistory, currentMission } = useTrueNorth();
  const { established, alignment } = useCompassAlignment();
  const evidenceEntries = useEvidenceEntries();

  return useMemo(() => {
    if (!weeklyBearings) {
      return {
        todaysBearing: null,
        weeklyBearingsList: [] as ReturnType<typeof resolveBearings>,
      };
    }

    const todaysBearing = recommendTodaysBearing(weeklyBearings, {
      alignment,
      established,
      dailyDebriefHistory,
      evidenceEntries,
      currentMission,
    });

    return {
      todaysBearing,
      weeklyBearingsList: resolveBearings(weeklyBearings.bearingIds),
    };
  }, [
    weeklyBearings,
    alignment,
    established,
    dailyDebriefHistory,
    evidenceEntries,
    currentMission,
  ]);
}
