import { getLocalDateString } from "@/lib/database/utils";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { EvidenceEntry } from "@/types/evidence";

/**
 * Build Evidence proof records from a completed Daily Debrief.
 * YES + evidence text → one permanent entry per standard.
 */
export function evidenceEntriesFromDebrief(
  debrief: DailyDebrief,
  options: {
    debriefDate?: string;
    missionReference?: string | null;
  } = {}
): Omit<EvidenceEntry, "id">[] {
  const debriefDate = options.debriefDate ?? getLocalDateString();
  const missionReference = options.missionReference?.trim() || null;

  return debrief.standards
    .filter(
      (standard) =>
        standard.answer === "yes" && standard.evidence.trim().length > 0
    )
    .map((standard) => ({
      evidenceDate: debriefDate,
      debriefDate,
      standardStatement: standard.statement,
      evidenceText: standard.evidence.trim(),
      missionReference,
      recordedAt: debrief.completedAt,
    }));
}
