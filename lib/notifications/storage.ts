import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications/defaults";
import type {
  NotificationReminderId,
  NotificationReminderPreference,
  NotificationSettings,
  WeekdayIndex,
} from "@/types/notifications";

const STORAGE_PREFIX = "true-north:notifications";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

function isWeekdayIndex(value: unknown): value is WeekdayIndex {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 6
  );
}

function normalizePreference(
  id: NotificationReminderId,
  incoming: Partial<NotificationReminderPreference> | undefined
): NotificationReminderPreference {
  const defaults = DEFAULT_NOTIFICATION_SETTINGS[id];
  if (!incoming || typeof incoming !== "object") {
    return { ...defaults };
  }

  const days = Array.isArray(incoming.days)
    ? (incoming.days.filter(isWeekdayIndex) as WeekdayIndex[])
    : defaults.days;

  const dayOfMonth =
    typeof incoming.dayOfMonth === "number" &&
    Number.isInteger(incoming.dayOfMonth) &&
    incoming.dayOfMonth >= 1 &&
    incoming.dayOfMonth <= 31
      ? incoming.dayOfMonth
      : defaults.dayOfMonth;

  const date =
    typeof incoming.date === "string" && /^\d{2}-\d{2}$/.test(incoming.date)
      ? incoming.date
      : defaults.date;

  return {
    enabled: Boolean(incoming.enabled),
    time:
      typeof incoming.time === "string" && /^\d{2}:\d{2}$/.test(incoming.time)
        ? incoming.time
        : defaults.time,
    ...(days !== undefined ? { days: days.length > 0 ? days : defaults.days } : {}),
    ...(dayOfMonth !== undefined ? { dayOfMonth } : {}),
    ...(date !== undefined ? { date } : {}),
  };
}

/** Merges partial/unknown JSON into a complete NotificationSettings object. */
export function mergeNotificationSettings(raw: unknown): NotificationSettings {
  const parsed =
    raw && typeof raw === "object"
      ? (raw as Partial<NotificationSettings>)
      : {};

  const merged = { ...DEFAULT_NOTIFICATION_SETTINGS } as NotificationSettings;

  (Object.keys(DEFAULT_NOTIFICATION_SETTINGS) as NotificationReminderId[]).forEach(
    (id) => {
      merged[id] = normalizePreference(id, parsed[id]);
    }
  );

  return merged;
}

export function loadNotificationSettings(userId: string): NotificationSettings {
  if (typeof window === "undefined") {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }

    return mergeNotificationSettings(JSON.parse(raw));
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(
  userId: string,
  settings: NotificationSettings
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey(userId), JSON.stringify(settings));
}

/** Annual MM-DD ↔ date input value (uses a fixed year for the native picker). */
export function annualDateToInputValue(date: string | undefined): string {
  const matched = date?.match(/^(\d{2})-(\d{2})$/);
  if (!matched) {
    return "2000-01-01";
  }
  return `2000-${matched[1]}-${matched[2]}`;
}

export function annualDateFromInputValue(value: string): string {
  const matched = value.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!matched) {
    return DEFAULT_NOTIFICATION_SETTINGS.annualReviewReminder.date ?? "01-01";
  }
  return `${matched[1]}-${matched[2]}`;
}
