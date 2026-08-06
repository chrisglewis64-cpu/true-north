import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import type { EvidenceEntry } from "@/types/evidence";

function findMissionIntentForDate(
  intentHistory: DatedMissionIntent[],
  debriefDate: string
): string | null {
  const match = intentHistory.find((entry) => entry.intentDate === debriefDate);
  return match?.intent.commitment ?? null;
}

/**
 * Automatically generate permanent Evidence proof entries from Daily Debriefs.
 * One entry per standard answered YES with non-empty evidence text.
 * Never created manually. Sorted newest first.
 */
export function buildEvidenceEntriesFromDebriefs(
  debriefHistory: DatedDailyDebrief[],
  missionIntentHistory: DatedMissionIntent[],
  missionName?: string | null
): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  for (const { debriefDate, debrief } of debriefHistory) {
    const missionReference =
      missionName?.trim() ||
      findMissionIntentForDate(missionIntentHistory, debriefDate);

    debrief.standards.forEach((standard, index) => {
      const evidenceText = standard.evidence.trim();
      if (standard.answer !== "yes" || !evidenceText) {
        return;
      }

      entries.push({
        id: `${debriefDate}-${index}`,
        evidenceDate: debriefDate,
        standardStatement: standard.statement,
        evidenceText,
        missionReference,
        debriefDate,
        recordedAt: debrief.completedAt,
      });
    });
  }

  return entries.sort((a, b) => {
    if (a.evidenceDate === b.evidenceDate) {
      return b.recordedAt.localeCompare(a.recordedAt);
    }
    return b.evidenceDate.localeCompare(a.evidenceDate);
  });
}

export function formatEvidenceDate(evidenceDate: string): string {
  const [year, month, day] = evidenceDate.split("-").map(Number);

  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
