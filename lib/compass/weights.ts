/** Relative influence of each signal on the final alignment score. */
export const ALIGNMENT_SIGNAL_WEIGHTS = {
  dailyDebriefs: 0.4,
  missionIntent: 0.15,
  missionActivity: 0.2,
  courseCorrections: 0.15,
  weeklyReviews: 0.1,
} as const;
