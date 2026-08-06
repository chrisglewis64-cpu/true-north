import type { WeeklyReview } from "@/types/review";
import type {
  AlignmentSignalResult,
  DatedDailyDebrief,
} from "@/lib/compass/types";

function scoreCorrectionPresence(hasCorrection: boolean): number {
  return hasCorrection ? 72 : 90;
}

export function scoreCourseCorrections(
  debriefs: DatedDailyDebrief[],
  weeklyReviews: WeeklyReview[]
): AlignmentSignalResult {
  const correctionScores: number[] = [];

  debriefs.forEach((entry) => {
    const hasCorrection = entry.debrief.courseCorrection.trim().length > 0;
    correctionScores.push(scoreCorrectionPresence(hasCorrection));
  });

  weeklyReviews.forEach((review) => {
    const hasCorrection = review.courseCorrection.trim().length > 0;
    correctionScores.push(scoreCorrectionPresence(hasCorrection));
  });

  if (correctionScores.length === 0) {
    return { score: 85, available: false };
  }

  const average =
    correctionScores.reduce((sum, score) => sum + score, 0) /
    correctionScores.length;

  return { score: average, available: true };
}
