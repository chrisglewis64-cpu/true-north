import { getLocalDateString } from "@/lib/database/utils";
import type { DatedMissionIntent } from "@/lib/compass/types";
import type { MissionIntent } from "@/types/mission-intent";

/**
 * Returns true when today's Commit flow (Mission Intent) is complete.
 * Resets automatically on the next calendar day.
 */
export function hasCompletedMorningCommit(
  todaysMissionIntent: MissionIntent | null,
  missionIntentHistory: DatedMissionIntent[]
): boolean {
  const today = getLocalDateString();

  if (todaysMissionIntent) {
    return true;
  }

  return missionIntentHistory.some((entry) => entry.intentDate === today);
}

export function getMorningCommitDate(
  todaysMissionIntent: MissionIntent | null,
  missionIntentHistory: DatedMissionIntent[]
): string | null {
  const today = getLocalDateString();

  if (todaysMissionIntent) {
    return today;
  }

  const todayEntry = missionIntentHistory.find(
    (entry) => entry.intentDate === today
  );

  return todayEntry?.intentDate ?? null;
}
