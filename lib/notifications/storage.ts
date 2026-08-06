import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications/defaults";
import type {
  NotificationReminderId,
  NotificationSettings,
} from "@/types/notifications";

const STORAGE_PREFIX = "true-north:notifications";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

function mergeSettings(raw: unknown): NotificationSettings {
  const parsed =
    raw && typeof raw === "object"
      ? (raw as Partial<NotificationSettings>)
      : {};

  const merged = { ...DEFAULT_NOTIFICATION_SETTINGS } as NotificationSettings;

  (Object.keys(DEFAULT_NOTIFICATION_SETTINGS) as NotificationReminderId[]).forEach(
    (id) => {
      const incoming = parsed[id];
      if (!incoming || typeof incoming !== "object") {
        return;
      }

      merged[id] = {
        ...DEFAULT_NOTIFICATION_SETTINGS[id],
        ...incoming,
        days: incoming.days ?? DEFAULT_NOTIFICATION_SETTINGS[id].days,
      };
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

    return mergeSettings(JSON.parse(raw));
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
