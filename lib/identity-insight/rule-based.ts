import { INSIGHT_LIBRARY } from "@/lib/identity-insight/library";
import type {
  AlignmentDirection,
  IdentityInsight,
  IdentityInsightContext,
  IdentityInsightFocus,
  IdentityInsightProvider,
} from "@/lib/identity-insight/types";

const TREND_STABLE_THRESHOLD = 0.3;
const MISSION_PROGRESS_LOW = 55;

function hashSeed(seed: string): number {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function resolveDirection(trendDelta: number): AlignmentDirection {
  if (trendDelta > TREND_STABLE_THRESHOLD) {
    return "improving";
  }
  if (trendDelta < -TREND_STABLE_THRESHOLD) {
    return "falling";
  }
  return "stable";
}

/**
 * Pick the behaviour that most needs coaching (or reinforcement).
 * Gaps take priority so the insight always points to one clear action.
 */
export function resolveInsightFocus(
  context: IdentityInsightContext
): IdentityInsightFocus {
  if (!context.established) {
    return "establishing";
  }

  if (!context.hasMorningCommitmentToday) {
    return "morning_commitment";
  }
  if (!context.hasDebriefToday) {
    return "debrief";
  }
  if (!context.hasEvidenceToday) {
    return "evidence";
  }
  if (context.missionProgressToday < MISSION_PROGRESS_LOW) {
    return "mission";
  }

  return "all_strong";
}

function pickMessage(
  focus: IdentityInsightFocus,
  direction: AlignmentDirection,
  seed: string
): string {
  const pool = INSIGHT_LIBRARY[focus][direction];
  const index = hashSeed(seed) % pool.length;
  return pool[index];
}

/**
 * Rule-based Identity Insight provider.
 * Replace with an AI provider later — same IdentityInsight shape.
 */
export const ruleBasedInsightProvider: IdentityInsightProvider = {
  getInsight(context: IdentityInsightContext): IdentityInsight {
    const focus = resolveInsightFocus(context);
    const direction = resolveDirection(context.trendDelta);
    const rotationSeed =
      context.rotationSeed ??
      `${context.asOfDate}:${focus}:${direction}:${context.alignment ?? 0}`;

    return {
      text: pickMessage(focus, direction, rotationSeed),
      source: "rules",
      focus,
      direction,
    };
  },
};
