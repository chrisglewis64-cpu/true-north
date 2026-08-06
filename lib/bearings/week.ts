import { getLocalDateString } from "@/lib/database/utils";

/**
 * Returns the Monday (local) of the week containing `date`, as YYYY-MM-DD.
 */
export function getWeekStart(date = new Date()): string {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = local.getDay(); // 0 Sun … 6 Sat
  const offset = day === 0 ? -6 : 1 - day;
  local.setDate(local.getDate() + offset);
  return getLocalDateString(local);
}

/**
 * Stable day index within the week (Monday = 0 … Sunday = 6).
 */
export function getWeekDayIndex(date = new Date()): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}
