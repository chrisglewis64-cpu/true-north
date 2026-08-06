/**
 * Compass heading — identity alignment with My Standard.
 * Not mission progress. Not a score.
 */
export type CompassHeading =
  | "true_north"
  | "drifting"
  | "off_course"
  | "lost";

/**
 * Current compass state displayed on Operations.
 * `alignment` is internal (0–100) — never render as a number.
 */
export interface CompassState {
  alignment: number;
  guidance: string;
}

/**
 * Alignment Report — opened from the Compass on the dashboard.
 * `alignment` is internal (0–100) — never render as a number.
 */
export interface AlignmentReport {
  alignment: number;
  strongestStandard: string;
  greatestOpportunity: string;
  currentDrift: string;
  suggestedCourseCorrection: string;
  missionAlignment: string;
  upcomingFocus: string;
}
