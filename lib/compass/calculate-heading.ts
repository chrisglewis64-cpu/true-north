import type {
  CompassAlignment,
  CompassHeading,
  CompassSignals,
} from "@/types/compass";

export function calculateCompassScore(signals: CompassSignals): number {
  let score = 0;

  if (signals.hasMissionIntent) score += 1;
  if (signals.hasDailyDebrief) score += 1;
  if (signals.hasActiveMission) score += 1;
  if (signals.hasWeeklyReview) score += 1;

  return score;
}

export function mapScoreToHeading(score: number): CompassHeading {
  if (score >= 4) return "true-north";
  if (score === 3) return "drifting";
  if (score === 2) return "off-course";
  return "lost";
}

export function calculateCompassAlignment(
  signals: CompassSignals
): CompassAlignment {
  const score = calculateCompassScore(signals);
  const heading = mapScoreToHeading(score);

  return { heading, score, signals };
}
