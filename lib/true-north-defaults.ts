import { theCode, todaysOnePercent, user } from "@/lib/placeholder-data";
import { placeholderMissions } from "@/lib/mission-data";
import { mergeLocalSessionIntoState } from "@/lib/storage/local-session";
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

export function createInitialTrueNorthState(): TrueNorthState {
  return mergeLocalSessionIntoState({
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
      startedAt: new Date().toISOString(),
      onboardingCompletedAt: new Date().toISOString(),
    },
    missions: placeholderMissions,
  });
}
