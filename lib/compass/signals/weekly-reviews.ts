import type {
  MissionIntentSuccess,
  StandardPerformanceRating,
  WeeklyReview,
} from "@/types/review";
import type { AlignmentSignalResult } from "@/lib/compass/types";

const INTENT_SUCCESS_SCORES: Record<MissionIntentSuccess, number> = {
  Honored: 95,
  Partial: 65,
  Missed: 40,
};

const STANDARD_RATING_SCORES: Record<StandardPerformanceRating, number> = {
  Strong: 92,
  Inconsistent: 62,
  Weak: 38,
};

export function scoreWeeklyReviews(
  weeklyReviews: WeeklyReview[]
): AlignmentSignalResult {
  if (weeklyReviews.length === 0) {
    return { score: 70, available: false };
  }

  const reviewScores = weeklyReviews.map((review) => {
    const intentScore = INTENT_SUCCESS_SCORES[review.missionIntentSuccess];
    const standardScores = review.standardPerformance.map(
      (entry) => STANDARD_RATING_SCORES[entry.rating]
    );
    const standardsAverage =
      standardScores.length > 0
        ? standardScores.reduce((sum, score) => sum + score, 0) /
          standardScores.length
        : intentScore;

    return intentScore * 0.4 + standardsAverage * 0.6;
  });

  const average =
    reviewScores.reduce((sum, score) => sum + score, 0) / reviewScores.length;

  return { score: average, available: true };
}
