/**
 * Identity Insight — coaching layer for the Compass.
 *
 * UI consumes only `IdentityInsight.text`. Swap the provider later
 * (rules → AI) without changing Compass components.
 */

export type IdentityInsightSource = "rules" | "ai";

/** Behavioural focus that drove the coaching sentence. */
export type IdentityInsightFocus =
  | "morning_commitment"
  | "evidence"
  | "debrief"
  | "mission"
  | "all_strong"
  | "establishing";

export type AlignmentDirection = "improving" | "stable" | "falling";

export type IdentityInsight = {
  /** Single coaching sentence shown under Identity Insight. */
  text: string;
  /** Which engine produced this insight — for analytics / future AI. */
  source: IdentityInsightSource;
  focus: IdentityInsightFocus;
  direction: AlignmentDirection;
};

export type IdentityInsightContext = {
  asOfDate: string;
  established: boolean;
  alignment: number | null;
  /** Seven-day Identity Alignment delta. */
  trendDelta: number;
  hasMorningCommitmentToday: boolean;
  hasEvidenceToday: boolean;
  hasDebriefToday: boolean;
  /** 0–100 mission progress signal for today. */
  missionProgressToday: number;
  /** Optional seed so messages rotate without feeling random. */
  rotationSeed?: string;
};

/**
 * Pluggable insight engine. Rule-based today; AI can implement this later.
 */
export interface IdentityInsightProvider {
  getInsight(context: IdentityInsightContext): IdentityInsight;
}
