/**
 * Proof that a standard or mission was lived — evidence over motivation.
 * @deprecated Prefer DebriefEvidenceEntry for debrief-derived evidence.
 */
export interface Evidence {
  id: string;
  label: string;
  missionId?: string;
  debriefId?: string;
  recordedAt: string;
}

/** One Evidence entry derived from a completed Daily Debrief. */
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
