"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { calculateCompassAlignment } from "@/lib/compass/calculate-heading";
import { getCompassGuidance } from "@/lib/compass/guidance";
import { getAlignmentPlaceholders } from "@/lib/compass/placeholders";
import { hasCompletedWeeklyReviewThisWeek } from "@/lib/data/reviews";
import { useApp } from "@/context/AppContext";
import { useMissions } from "@/hooks/useMissions";

export function useCompassAlignment() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const { todaysCommitment, todaysDebrief } = useApp();
  const { activeMission } = useMissions();
  const [hasWeeklyReview, setHasWeeklyReview] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    void hasCompletedWeeklyReviewThisWeek(supabase, user.id).then(
      setHasWeeklyReview,
    );
  }, [supabase, user, todaysDebrief]);

  return useMemo(() => {
    const signals = {
      hasMissionIntent: Boolean(todaysCommitment.trim()),
      hasDailyDebrief: todaysDebrief !== null,
      hasActiveMission: Boolean(activeMission),
      hasWeeklyReview: user ? hasWeeklyReview : false,
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
  }, [todaysCommitment, todaysDebrief, activeMission, hasWeeklyReview]);
}

export type CompassAlignmentView = ReturnType<typeof useCompassAlignment>;
