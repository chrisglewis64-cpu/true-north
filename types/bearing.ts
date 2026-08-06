/**
 * A Bearing is a tiny identity correction — not a habit, mission, or task.
 * Small disciplines that slowly shape character.
 */
export interface Bearing {
  id: string;
  statement: string;
  /** System library vs user-created. */
  source: "system" | "custom";
  createdAt: string;
}

/**
 * Exactly three Bearings chosen for the current week.
 * Three is memorable. Never more.
 */
export interface WeeklyBearings {
  weekStart: string;
  bearingIds: [string, string, string];
  selectedAt: string;
  /** How the three were chosen. */
  source: "recommended" | "manual";
}

/**
 * The single Bearing the user should remember today.
 */
export interface TodaysBearing {
  date: string;
  bearing: Bearing;
  /** Short rule-based reason — ready for future AI recommendations. */
  reason: string;
}
