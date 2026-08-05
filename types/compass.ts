export type CompassHeading =
  | "true-north"
  | "drifting"
  | "off-course"
  | "lost";

export type CompassSignals = {
  hasMissionIntent: boolean;
  hasDailyDebrief: boolean;
  hasActiveMission: boolean;
  hasWeeklyReview: boolean;
};

export type CompassAlignment = {
  heading: CompassHeading;
  score: number;
  signals: CompassSignals;
};

export const HEADING_LABELS: Record<CompassHeading, string> = {
  "true-north": "TRUE NORTH",
  drifting: "DRIFTING",
  "off-course": "OFF COURSE",
  lost: "LOST",
};

export const HEADING_DOT_CLASS: Record<CompassHeading, string> = {
  "true-north": "bg-accent",
  drifting: "bg-yellow-400/90",
  "off-course": "bg-orange-400/90",
  lost: "bg-red-400/90",
};

/** Arrow rotation in degrees — 0° points to north. */
export const HEADING_ARROW_ROTATION: Record<CompassHeading, number> = {
  "true-north": 0,
  drifting: 20,
  "off-course": 45,
  lost: 90,
};

export const HEADING_ACCENT_CLASS: Record<CompassHeading, string> = {
  "true-north": "text-accent",
  drifting: "text-yellow-400/90",
  "off-course": "text-orange-400/90",
  lost: "text-red-400/90",
};

export const COMPASS_LAYOUT_ID = "compass-dial";
