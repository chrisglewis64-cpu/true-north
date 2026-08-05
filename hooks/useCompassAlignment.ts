import { calculateCompassAlignment } from "@/lib/compass/calculate-heading";
import { getCompassGuidance } from "@/lib/compass/guidance";
import { getAlignmentPlaceholders } from "@/lib/compass/placeholders";
import { hasCompletedWeeklyReviewThisWeek } from "@/lib/storage/review-state";
import { useApp } from "@/context/AppContext";
import { useMissions } from "@/hooks/useMissions";
import { useMemo } from "react";

export function useCompassAlignment() {
  const { todaysCommitment, todaysDebrief } = useApp();
  const { activeMission } = useMissions();

  return useMemo(() => {
    const signals = {
      hasMissionIntent: Boolean(todaysCommitment.trim()),
      hasDailyDebrief: todaysDebrief !== null,
      hasActiveMission: Boolean(activeMission),
      hasWeeklyReview: hasCompletedWeeklyReviewThisWeek(),
    };

    const alignment = calculateCompassAlignment(signals);
    const guidance = getCompassGuidance(alignment.heading);
    const placeholders = getAlignmentPlaceholders(alignment.heading);

    return {
      alignment,
      guidance,
      placeholders,
      activeMission,
    };
  }, [todaysCommitment, todaysDebrief, activeMission]);
}

export type CompassAlignmentView = ReturnType<typeof useCompassAlignment>;
