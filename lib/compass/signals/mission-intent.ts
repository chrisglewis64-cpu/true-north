import type {
  AlignmentSignalResult,
  DatedDailyDebrief,
  DatedMissionIntent,
} from "@/lib/compass/types";

export function scoreMissionIntent(
  intents: DatedMissionIntent[],
  debriefs: DatedDailyDebrief[]
): AlignmentSignalResult {
  if (intents.length === 0) {
    return { score: 70, available: false };
  }

  const debriefDates = new Set(debriefs.map((entry) => entry.debriefDate));
  const honoredDays = intents.filter((entry) =>
    debriefDates.has(entry.intentDate)
  ).length;
  const completionRate = honoredDays / intents.length;

  return {
    score: 55 + completionRate * 45,
    available: true,
  };
}
