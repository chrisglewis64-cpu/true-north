import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { MissionIntent } from "@/types/mission-intent";

export function upsertDatedDebrief(
  history: DatedDailyDebrief[],
  debriefDate: string,
  debrief: DailyDebrief
): DatedDailyDebrief[] {
  const withoutDate = history.filter((entry) => entry.debriefDate !== debriefDate);
  return [{ debriefDate, debrief }, ...withoutDate].sort((a, b) =>
    b.debriefDate.localeCompare(a.debriefDate)
  );
}

export function upsertDatedMissionIntent(
  history: DatedMissionIntent[],
  intentDate: string,
  intent: MissionIntent
): DatedMissionIntent[] {
  const withoutDate = history.filter((entry) => entry.intentDate !== intentDate);
  return [{ intentDate, intent }, ...withoutDate].sort((a, b) =>
    b.intentDate.localeCompare(a.intentDate)
  );
}
