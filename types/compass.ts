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

/** Orbit angle in degrees clockwise from north — arrow sits on the outer ring. */
export const HEADING_ORBIT_ANGLE: Record<CompassHeading, number> = {
  "true-north": 0,
  drifting: 20,
  "off-course": 45,
  lost: 90,
};

/** @deprecated Use HEADING_ORBIT_ANGLE */
export const HEADING_ARROW_ROTATION = HEADING_ORBIT_ANGLE;

export const COMPASS_OUTER_RADIUS = 92;

export const HEADING_ACCENT_CLASS: Record<CompassHeading, string> = {
  "true-north": "text-accent",
  drifting: "text-yellow-400/90",
  "off-course": "text-orange-400/90",
  lost: "text-red-400/90",
};

/** Muted arrow fill per heading — matches status colours. */
export const HEADING_ARROW_FILL_CLASS: Record<CompassHeading, string> = {
  "true-north": "text-accent",
  drifting: "text-yellow-500/70",
  "off-course": "text-orange-400/75",
  lost: "text-red-400/75",
};

export const COMPASS_LAYOUT_ID = "compass-dial";
