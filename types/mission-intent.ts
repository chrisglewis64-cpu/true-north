/**
 * How the user entered today's mission intent.
 */
export type MissionIntentSource = "suggested" | "custom";

/**
 * Today's daily commitment set during Mission Intent.
 * Separate from long-running Missions — this is the morning anchor.
 */
export interface MissionIntent {
  commitment: string;
  source: MissionIntentSource;
  createdAt: string;
}

/**
 * Form input before a MissionIntent is committed.
 */
export interface MissionIntentInput {
  mode: MissionIntentSource;
  suggestion: string;
  customText: string;
  isSelected: boolean;
}
