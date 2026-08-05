import { getCalendarDateKey } from "@/lib/storage/local-session";

const WEEKLY_REVIEW_KEY = "true-north:weekly-review";

type WeeklyReviewRecord = {
  weekKey: string;
  completedAt: string;
};

function getWeekKey(date = new Date()): string {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  return getCalendarDateKey(start);
}

export function hasCompletedWeeklyReviewThisWeek(date = new Date()): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.localStorage.getItem(WEEKLY_REVIEW_KEY);
    if (!raw) {
      return false;
    }

    const record = JSON.parse(raw) as WeeklyReviewRecord;
    return record.weekKey === getWeekKey(date);
  } catch {
    return false;
  }
}

export function markWeeklyReviewComplete(date = new Date()): void {
  const record: WeeklyReviewRecord = {
    weekKey: getWeekKey(date),
    completedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(WEEKLY_REVIEW_KEY, JSON.stringify(record));
}
