/**
 * Compass alignment calculation.
 *
 * Aggregates weighted signals from session data. The numeric result is internal —
 * never render in UI. Wired via `useCompassAlignment()`.
 *
 * @see lib/compass/signals/ — individual signal scorers
 * @see lib/compass/weights.ts — signal weights
 */

import type { DailyDebrief } from "@/types/daily-debrief";
import type { Mission } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { WeeklyReview } from "@/types/review";
import type { CompassAlignment } from "@/lib/compass/alignment";
import { scoreCourseCorrections } from "@/lib/compass/signals/course-corrections";
import { scoreDailyDebriefs } from "@/lib/compass/signals/daily-debriefs";
import { scoreMissionActivity } from "@/lib/compass/signals/mission-activity";
import { scoreMissionIntent } from "@/lib/compass/signals/mission-intent";
import { scoreWeeklyReviews } from "@/lib/compass/signals/weekly-reviews";
import {
  clampAlignmentScore,
  INSUFFICIENT_DATA_MESSAGE,
  MIN_DEBRIEFS_FOR_HEADING,
  weightedAverage,
  type DatedDailyDebrief,
  type DatedMissionIntent,
} from "@/lib/compass/types";
import { ALIGNMENT_SIGNAL_WEIGHTS } from "@/lib/compass/weights";

export {
  INSUFFICIENT_DATA_MESSAGE,
  MIN_DEBRIEFS_FOR_HEADING,
} from "@/lib/compass/types";

export interface CalculateAlignmentInput {
  dailyDebriefs?: DatedDailyDebrief[];
  missionIntents?: DatedMissionIntent[];
  currentMission?: Mission | null;
  weeklyReviews?: WeeklyReview[];
}

export interface CalculateAlignmentResult {
  /** Whether enough debrief history exists to show a heading. */
  established: boolean;
  /** Internal score 0–100. Null when heading is not yet established. */
  alignment: CompassAlignment | null;
  /** Shown on the Compass when `established` is false. */
  message?: string;
}

export function calculateAlignment(
  input: CalculateAlignmentInput = {}
): CalculateAlignmentResult {
  const dailyDebriefs = input.dailyDebriefs ?? [];
  const missionIntents = input.missionIntents ?? [];
  const weeklyReviews = input.weeklyReviews ?? [];

  if (dailyDebriefs.length < MIN_DEBRIEFS_FOR_HEADING) {
    return {
      established: false,
      alignment: null,
      message: INSUFFICIENT_DATA_MESSAGE,
    };
  }

  const debriefSignal = scoreDailyDebriefs(dailyDebriefs);
  const intentSignal = scoreMissionIntent(missionIntents, dailyDebriefs);
  const missionSignal = scoreMissionActivity(input.currentMission);
  const correctionSignal = scoreCourseCorrections(dailyDebriefs, weeklyReviews);
  const reviewSignal = scoreWeeklyReviews(weeklyReviews);

  const alignment = clampAlignmentScore(
    weightedAverage([
      { ...debriefSignal, weight: ALIGNMENT_SIGNAL_WEIGHTS.dailyDebriefs },
      { ...intentSignal, weight: ALIGNMENT_SIGNAL_WEIGHTS.missionIntent },
      { ...missionSignal, weight: ALIGNMENT_SIGNAL_WEIGHTS.missionActivity },
      { ...correctionSignal, weight: ALIGNMENT_SIGNAL_WEIGHTS.courseCorrections },
      { ...reviewSignal, weight: ALIGNMENT_SIGNAL_WEIGHTS.weeklyReviews },
    ])
  );

  return {
    established: true,
    alignment,
  };
}

/** @deprecated Use calculateAlignment result. Kept for tests and migration. */
export const PLACEHOLDER_ALIGNMENT: CompassAlignment = 94;

/** @deprecated Use DatedDailyDebrief in CalculateAlignmentInput */
export type LegacyCalculateAlignmentInput = {
  missionIntent?: MissionIntent | null;
  dailyDebriefs?: DailyDebrief[];
  currentMission?: Mission | null;
  weeklyReviews?: WeeklyReview[];
};
