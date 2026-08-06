import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import type { DebriefEvidenceEntry } from "@/types/evidence";

function findMissionIntentForDate(
  intentHistory: DatedMissionIntent[],
  debriefDate: string
): string | null {
  const match = intentHistory.find((entry) => entry.intentDate === debriefDate);
  return match?.intent.commitment ?? null;
}

export function buildEvidenceEntriesFromDebriefs(
  debriefHistory: DatedDailyDebrief[],
  missionIntentHistory: DatedMissionIntent[]
): DebriefEvidenceEntry[] {
  return debriefHistory.map(({ debriefDate, debrief }) => ({
    id: debriefDate,
    debriefDate,
    missionIntent: findMissionIntentForDate(missionIntentHistory, debriefDate),
    standardsYes: debrief.standards
      .filter((entry) => entry.answer === "yes")
      .map((entry) => entry.statement),
    biggestWin: debrief.biggestWin,
    biggestLesson: debrief.biggestLesson,
    courseCorrection: debrief.courseCorrection,
    recordedAt: debrief.completedAt,
  }));
}

export function formatEvidenceDate(debriefDate: string): string {
  const [year, month, day] = debriefDate.split("-").map(Number);

  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
