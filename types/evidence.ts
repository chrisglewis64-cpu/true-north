/**
 * Permanent proof that a standard was lived.
 * Created automatically from Daily Debrief — never manually.
 * No editing. No deleting. Evidence is history.
 */
export interface EvidenceEntry {
  id: string;
  evidenceDate: string;
  standardStatement: string;
  evidenceText: string;
  /** Optional mission name or intent reference. */
  missionReference: string | null;
  debriefDate: string;
  recordedAt: string;
}

/**
 * @deprecated Prefer EvidenceEntry — proof timeline entries.
 */
export interface Evidence {
  id: string;
  label: string;
  missionId?: string;
  debriefId?: string;
  recordedAt: string;
}

/**
 * @deprecated Prefer EvidenceEntry built from per-standard proof.
 */
export interface DebriefEvidenceEntry {
  id: string;
  debriefDate: string;
  missionIntent: string | null;
  standardsYes: string[];
  biggestWin: string;
  biggestLesson: string;
  courseCorrection: string;
  recordedAt: string;
}
