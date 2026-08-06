import { ruleBasedInsightProvider } from "@/lib/identity-insight/rule-based";
import type {
  IdentityInsight,
  IdentityInsightContext,
  IdentityInsightProvider,
} from "@/lib/identity-insight/types";

let activeProvider: IdentityInsightProvider = ruleBasedInsightProvider;

/**
 * Swap the insight engine (e.g. AI) without changing Compass UI.
 */
export function setIdentityInsightProvider(
  provider: IdentityInsightProvider
): void {
  activeProvider = provider;
}

export function resetIdentityInsightProvider(): void {
  activeProvider = ruleBasedInsightProvider;
}

/**
 * Resolves a single coaching sentence for the Compass.
 * UI should only read `insight.text`.
 */
export function getIdentityInsight(
  context: IdentityInsightContext
): IdentityInsight {
  return activeProvider.getInsight(context);
}

export type {
  IdentityInsight,
  IdentityInsightContext,
  IdentityInsightFocus,
  IdentityInsightProvider,
  IdentityInsightSource,
  AlignmentDirection,
} from "@/lib/identity-insight/types";

export { resolveInsightFocus } from "@/lib/identity-insight/rule-based";
