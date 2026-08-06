import {
  recommendWeeklyBearings,
  type BearingRecommendationContext,
} from "@/lib/bearings/recommend";
import { getWeekStart } from "@/lib/bearings/week";
import type { WeeklyBearings } from "@/types/bearing";

/**
 * Ensure the user has exactly three Bearings for the current week.
 * Auto-recommends when none are set — low friction, still overridable.
 */
export function ensureWeeklyBearings(
  current: WeeklyBearings | null,
  context: BearingRecommendationContext
): WeeklyBearings {
  const weekStart = getWeekStart(context.date);
  if (current && current.weekStart === weekStart) {
    return current;
  }

  const recommendation = recommendWeeklyBearings(context);
  return {
    weekStart,
    bearingIds: recommendation.bearingIds,
    selectedAt: new Date().toISOString(),
    source: "recommended",
  };
}
