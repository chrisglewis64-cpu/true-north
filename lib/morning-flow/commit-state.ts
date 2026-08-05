import {
  createEmptyDailySession,
  getCalendarDateKey,
  readDailySession,
  writeDailySession,
  type DailySession,
} from "@/lib/storage/local-session";

export function getDailySession(): DailySession {
  const stored = readDailySession();
  const today = getCalendarDateKey();

  if (!stored || stored.date !== today) {
    return createEmptyDailySession();
  }

  return stored;
}

export function hasCompletedMorningCommit(): boolean {
  return getDailySession().morningCommitCompleted;
}

export function markMorningCommitComplete(commitment: string): DailySession {
  const session: DailySession = {
    ...getDailySession(),
    date: getCalendarDateKey(),
    morningCommitCompleted: true,
    todaysCommitment: commitment,
  };

  writeDailySession(session);
  return session;
}

export function updateDailySession(
  patch: Partial<
    Pick<
      DailySession,
      "todaysCommitment" | "todaysOnePercent" | "todaysDebrief"
    >
  >
): DailySession {
  const session = {
    ...getDailySession(),
    ...patch,
    date: getCalendarDateKey(),
  };

  writeDailySession(session);
  return session;
}
