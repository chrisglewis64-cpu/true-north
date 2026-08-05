import type { DebriefSubmission } from "@/lib/debrief-form";

const DAILY_SESSION_KEY = "true-north:daily-session";
const DEBRIEF_HISTORY_KEY = "true-north:debrief-history";

export type DebriefRecord = DebriefSubmission & {
  date: string;
  completedAt: string;
};

export type DailySession = {
  date: string;
  morningCommitCompleted: boolean;
  todaysCommitment: string;
  todaysOnePercent: string;
  todaysDebrief: DebriefSubmission | null;
};

export function getCalendarDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readDailySession(): DailySession | null {
  return readJson<DailySession>(DAILY_SESSION_KEY);
}

export function writeDailySession(session: DailySession): void {
  writeJson(DAILY_SESSION_KEY, session);
}

export function readDebriefHistory(): DebriefRecord[] {
  return readJson<DebriefRecord[]>(DEBRIEF_HISTORY_KEY) ?? [];
}

export function writeDebriefHistory(history: DebriefRecord[]): void {
  writeJson(DEBRIEF_HISTORY_KEY, history);
}

export function createEmptyDailySession(): DailySession {
  return {
    date: getCalendarDateKey(),
    morningCommitCompleted: false,
    todaysCommitment: "",
    todaysOnePercent: "",
    todaysDebrief: null,
  };
}
