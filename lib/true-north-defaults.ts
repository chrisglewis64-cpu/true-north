import { theCode, todaysOnePercent, user } from "@/lib/placeholder-data";
import { placeholderMissions } from "@/lib/mission-data";
import { EMPTY_ONBOARDING_PROGRESS } from "@/lib/onboarding/stages";
import type { Standard } from "@/types/standard";
import type { TrueNorthState } from "@/types/true-north";

export function createStandardsFromStatements(
  statements: readonly string[]
): Standard[] {
  return statements.map((statement, index) => ({
    id: `standard-${index + 1}`,
    order: index + 1,
    statement,
  }));
}

/**
 * Baseline state safe for SSR — no localStorage reads.
 * Local session merge happens client-side after mount.
 */
export function createInitialTrueNorthState(): TrueNorthState {
  return {
    myStandard: createStandardsFromStatements(theCode),
    todaysMissionIntent: null,
    todaysOnePercent: {
      improvement: todaysOnePercent.improvement,
      setAt: new Date().toISOString(),
      source: "seed",
    },
    weeklyBearings: null,
    dailyDebrief: {
      submission: null,
      draft: null,
    },
    dailyDebriefHistory: [],
    missionIntentHistory: [],
    weeklyReviews: [],
    session: {
      id: "session-local",
      displayName: user.name,
      email: null,
      startedAt: new Date().toISOString(),
      onboardingCompletedAt: new Date().toISOString(),
      onboarding: {
        ...EMPTY_ONBOARDING_PROGRESS,
        welcomeCompletedAt: new Date().toISOString(),
        standardsCompletedAt: new Date().toISOString(),
        missionCompletedAt: new Date().toISOString(),
        onboardingCompletedAt: new Date().toISOString(),
      },
    },
    missions: placeholderMissions,
  };
}
