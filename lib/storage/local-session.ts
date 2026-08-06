import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import { getLocalDateString } from "@/lib/database/utils";
import type { WeeklyBearings } from "@/types/bearing";
import type { MissionIntent } from "@/types/mission-intent";
import type { TrueNorthState } from "@/types/true-north";

const STORAGE_PREFIX = "true-north:session";

export interface LocalSessionSnapshot {
  todaysMissionIntent: MissionIntent | null;
  dailyDebriefHistory: DatedDailyDebrief[];
  missionIntentHistory: DatedMissionIntent[];
  weeklyBearings: WeeklyBearings | null;
}

function storageKey(sessionId: string): string {
  return `${STORAGE_PREFIX}:${sessionId}`;
}

export function loadLocalSessionSnapshot(
  sessionId: string
): LocalSessionSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(sessionId));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<LocalSessionSnapshot>;
    return {
      todaysMissionIntent: parsed.todaysMissionIntent ?? null,
      dailyDebriefHistory: parsed.dailyDebriefHistory ?? [],
      missionIntentHistory: parsed.missionIntentHistory ?? [],
      weeklyBearings: parsed.weeklyBearings ?? null,
    };
  } catch {
    return null;
  }
}

export function saveLocalSessionSnapshot(
  sessionId: string,
  snapshot: LocalSessionSnapshot
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(sessionId), JSON.stringify(snapshot));
}

function resolveTodaysMissionIntent(
  snapshot: LocalSessionSnapshot
): MissionIntent | null {
  const today = getLocalDateString();
  const todayFromHistory = snapshot.missionIntentHistory.find(
    (entry) => entry.intentDate === today
  );

  if (todayFromHistory) {
    return todayFromHistory.intent;
  }

  const intent = snapshot.todaysMissionIntent;
  if (
    intent &&
    getLocalDateString(new Date(intent.createdAt)) === today
  ) {
    return intent;
  }

  return null;
}

export function mergeLocalSessionIntoState(state: TrueNorthState): TrueNorthState {
  const snapshot = loadLocalSessionSnapshot(state.session.id);

  if (!snapshot) {
    return state;
  }

  const todaysMissionIntent = resolveTodaysMissionIntent(snapshot);

  return {
    ...state,
    todaysMissionIntent,
    weeklyBearings: snapshot.weeklyBearings ?? state.weeklyBearings,
    dailyDebriefHistory: snapshot.dailyDebriefHistory,
    missionIntentHistory: snapshot.missionIntentHistory,
    dailyDebrief: {
      ...state.dailyDebrief,
      submission:
        snapshot.dailyDebriefHistory.find(
          (entry) => entry.debriefDate === getLocalDateString()
        )?.debrief ?? state.dailyDebrief.submission,
    },
  };
}

export function createLocalSessionSnapshot(
  state: Pick<
    TrueNorthState,
    | "todaysMissionIntent"
    | "dailyDebriefHistory"
    | "missionIntentHistory"
    | "weeklyBearings"
  >
): LocalSessionSnapshot {
  return {
    todaysMissionIntent: state.todaysMissionIntent,
    dailyDebriefHistory: state.dailyDebriefHistory,
    missionIntentHistory: state.missionIntentHistory,
    weeklyBearings: state.weeklyBearings,
  };
}
