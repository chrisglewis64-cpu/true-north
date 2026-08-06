/** Minimum completed debriefs before the Compass shows a heading. */
export const MIN_DEBRIEFS_FOR_HEADING = 3;

export const INSUFFICIENT_DATA_MESSAGE =
  "Complete more Daily Debriefs to establish your heading.";

/** Lookback window for recency-weighted signals. */
export const ALIGNMENT_LOOKBACK_DAYS = 14;

export type DatedDailyDebrief = {
  debriefDate: string;
  debrief: import("@/types/daily-debrief").DailyDebrief;
};

export type DatedMissionIntent = {
  intentDate: string;
  intent: import("@/types/mission-intent").MissionIntent;
};

export type AlignmentSignalResult = {
  score: number;
  available: boolean;
};

export function clampAlignmentScore(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function weightedAverage(
  signals: Array<{ score: number; weight: number; available: boolean }>
): number {
  const active = signals.filter((signal) => signal.available);

  if (active.length === 0) {
    return 70;
  }

  const totalWeight = active.reduce((sum, signal) => sum + signal.weight, 0);
  const weightedSum = active.reduce(
    (sum, signal) => sum + signal.score * signal.weight,
    0
  );

  return weightedSum / totalWeight;
}
