import {
  getNotificationPermissionState,
  requestNotificationPermissionOnce,
  type NotificationPermissionState,
} from "@/lib/notifications/permission";
import type { NotificationSettings } from "@/types/notifications";

export type { NotificationPermissionState };

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
    return getNotificationPermissionState();
  },

  async requestPermission() {
    return requestNotificationPermissionOnce();
  },

  async syncSchedules(settings) {
    void settings;
    // Placeholder — future: sync with service worker push scheduling via lib/pwa/push-notifications.ts
  },

  async clearSchedules() {
    // Placeholder — future: cancel push schedules registered in app/sw.ts
  },
};
