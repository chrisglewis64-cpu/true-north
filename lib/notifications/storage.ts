import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications/defaults";
import type { NotificationSettings } from "@/types/notifications";

const STORAGE_PREFIX = "true-north:notifications";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
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

    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...JSON.parse(raw),
    } as NotificationSettings;
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
