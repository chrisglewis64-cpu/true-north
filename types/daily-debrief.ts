/**
 * Answer to a single standard review during Debrief Step 1.
 */
export type StandardAnswer = "yes" | "no" | null;

/**
 * In-progress review of one standard principle.
 */
export interface StandardReviewEntry {
  answer: StandardAnswer;
  evidence: string;
}

/**
 * The four guided steps of the Daily Debrief flow.
 */
export type DebriefStep = 1 | 2 | 3 | 4;

/**
 * In-progress debrief state — persisted while the user moves through steps.
 */
export interface DailyDebriefDraft {
  step: DebriefStep;
  standardIndex: number;
  standards: StandardReviewEntry[];
  biggestWin: string;
  biggestLesson: string;
  tomorrowOnePercent: string;
  tomorrowPriority: string;
  courseCorrection: string;
}

/**
 * A completed standard review entry within a submitted debrief.
 */
export interface DailyDebriefStandardEntry {
  statement: string;
  answer: StandardAnswer;
  evidence: string;
}

/**
 * A completed Daily Debrief — the centre of the application.
 * Captures identity evidence, reflection, tomorrow's direction, and course correction.
 * YES + evidence text automatically creates permanent Evidence records.
 */
export interface DailyDebrief {
  standards: DailyDebriefStandardEntry[];
  biggestWin: string;
  biggestLesson: string;
  tomorrowOnePercent: string;
  tomorrowPriority: string;
  courseCorrection: string;
  completedAt: string;
}

/**
 * Combined debrief state: in-progress draft and completed submission.
 */
export interface DailyDebriefState {
  submission: DailyDebrief | null;
  draft: DailyDebriefDraft | null;
}
