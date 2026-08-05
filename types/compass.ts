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

export const HEADING_INDICATORS: Record<CompassHeading, string> = {
  "true-north": "🟢",
  drifting: "🟡",
  "off-course": "🟠",
  lost: "🔴",
};

/** Needle rotation in degrees — 0 points north. */
export const HEADING_NEEDLE_ROTATION: Record<CompassHeading, number> = {
  "true-north": 0,
  drifting: 22,
  "off-course": 48,
  lost: 72,
};

export const HEADING_ACCENT_CLASS: Record<CompassHeading, string> = {
  "true-north": "text-accent",
  drifting: "text-yellow-400/90",
  "off-course": "text-orange-400/90",
  lost: "text-red-400/90",
};
