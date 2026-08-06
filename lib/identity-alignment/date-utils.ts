import { getLocalDateString } from "@/lib/database/utils";

/** Shift a YYYY-MM-DD local date by `days` (negative = past). */
export function shiftLocalDate(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

/** Inclusive list of local dates from `start` through `end` (YYYY-MM-DD). */
export function eachLocalDateInclusive(
  start: string,
  end: string
): string[] {
  if (start > end) {
    return [];
  }

  const dates: string[] = [];
  let cursor = start;

  while (cursor <= end) {
    dates.push(cursor);
    cursor = shiftLocalDate(cursor, 1);
  }

  return dates;
}

export function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}

export function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export function roundAlignment(value: number): number {
  return Math.round(clampScore(value));
}
