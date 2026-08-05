/**
 * Status of a review cycle.
 */
export type ReviewStatus = "draft" | "completed";

/**
 * Qualitative assessment of mission intent adherence for the week.
 */
export type MissionIntentSuccess = "Honored" | "Partial" | "Missed";

/**
 * Single-word standard performance rating for weekly review.
 */
export type StandardPerformanceRating = "Strong" | "Inconsistent" | "Weak";

export interface StandardPerformanceEntry {
  order: number;
  statement: string;
  rating: StandardPerformanceRating;
}

/**
 * Weekly Review — tactical reflection on mission, standards, and course.
 */
export interface WeeklyReview {
  weekLabel: string;
  weekStarting: string;
  missionName: string;
  missionPurpose: string;
  missionStatus: "on_track" | "at_risk" | "off_course" | "complete";
  missionIntent: string;
  missionIntentSuccess: MissionIntentSuccess;
  standardPerformance: StandardPerformanceEntry[];
  biggestWin: string;
  biggestLesson: string;
  courseCorrection: string;
  planNextWeek: string;
}

/**
 * Monthly Review — strategic patterns and priorities.
 */
export interface MonthlyReview {
  monthLabel: string;
  missionName: string;
  missionProgress: string;
  missionProgressNarrative: string;
  patterns: string[];
  achievements: string[];
  lessons: string[];
  priorities: string[];
}

/**
 * Completed mission summary for annual review.
 */
export interface AnnualCompletedMission {
  name: string;
  completedLabel: string;
  lessonsLearned: string;
}

/**
 * Annual Review — identity, proof, and letter to future self.
 */
export interface AnnualReview {
  year: number;
  completedMissions: AnnualCompletedMission[];
  greatestWins: string[];
  greatestLessons: string[];
  identityGrowth: string;
  letterToFutureMe: string;
  letterSignedDate: string;
}

/** @deprecated Use WeeklyReview fields — kept for earlier draft shape */
export interface ReviewDraft {
  weekStarting: string;
  biggestWin: string;
  biggestLesson: string;
  missionStatusNotes: string;
  nextWeekFocus: string;
}

/** @deprecated Use WeeklyReview — kept for earlier shape */
export interface Review {
  id: string;
  weekStarting: string;
  biggestWin: string;
  biggestLesson: string;
  missionStatusNotes: string;
  nextWeekFocus: string;
  status: ReviewStatus;
  completedAt: string;
}
