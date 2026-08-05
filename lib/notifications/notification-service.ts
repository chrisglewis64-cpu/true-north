import type { NotificationSettings } from "@/types/notifications";

export type NotificationPermissionState =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

/**
 * Abstraction for scheduling reminders.
 * Swap `placeholderNotificationService` for a browser implementation later.
 */
export interface NotificationService {
  getPermissionState(): NotificationPermissionState;
  requestPermission(): Promise<NotificationPermissionState>;
  syncSchedules(settings: NotificationSettings): Promise<void>;
  clearSchedules(): Promise<void>;
}

export const placeholderNotificationService: NotificationService = {
  getPermissionState() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    return Notification.permission;
  },

  async requestPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    return Notification.requestPermission();
  },

  async syncSchedules(settings) {
    void settings;
    // Placeholder — future: sync with service worker push scheduling via lib/pwa/push-notifications.ts
  },

  async clearSchedules() {
    // Placeholder — future: cancel push schedules registered in app/sw.ts
  },
};
