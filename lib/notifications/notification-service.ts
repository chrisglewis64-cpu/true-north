import {
  getNotificationPermissionState,
  requestNotificationPermissionOnce,
  type NotificationPermissionState,
} from "@/lib/notifications/permission";
import { registerBrowserPushSubscription } from "@/lib/notifications/register-push";
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
    // Preference sync only — push delivery scheduling lands later.
  },

  async clearSchedules() {
    // Placeholder — future: cancel scheduled reminder pushes
  },
};

export { registerBrowserPushSubscription };
