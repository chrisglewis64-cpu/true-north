import { getLocalDateString } from "@/lib/database/utils";
import type { DatedMissionIntent } from "@/lib/compass/types";
import type { MissionIntent } from "@/types/mission-intent";

function isIntentForToday(intent: MissionIntent): boolean {
  return getLocalDateString(new Date(intent.createdAt)) === getLocalDateString();
}

/**
 * Returns true when today's Morning Commitment is complete.
 * Resets automatically on the next local calendar day.
 */
export function hasCompletedMorningCommit(
  todaysMissionIntent: MissionIntent | null,
  missionIntentHistory: DatedMissionIntent[]
): boolean {
  const today = getLocalDateString();

  if (missionIntentHistory.some((entry) => entry.intentDate === today)) {
    return true;
  }

  if (todaysMissionIntent && isIntentForToday(todaysMissionIntent)) {
    return true;
  }

  return false;
}

export function getMorningCommitDate(
  todaysMissionIntent: MissionIntent | null,
  missionIntentHistory: DatedMissionIntent[]
): string | null {
  const today = getLocalDateString();

  if (missionIntentHistory.some((entry) => entry.intentDate === today)) {
    return today;
  }

  if (todaysMissionIntent && isIntentForToday(todaysMissionIntent)) {
    return today;
  }

  return null;
}
