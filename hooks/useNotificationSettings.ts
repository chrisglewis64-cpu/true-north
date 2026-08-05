"use client";

import { useCallback, useState } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { placeholderNotificationService } from "@/lib/notifications/notification-service";
import {
  loadNotificationSettings,
  saveNotificationSettings,
} from "@/lib/notifications/storage";
import type {
  NotificationReminderId,
  NotificationReminderPreference,
  NotificationSettings,
} from "@/types/notifications";

export function useNotificationSettings() {
  const { session } = useTrueNorth();
  const [settings, setSettings] = useState<NotificationSettings>(() =>
    loadNotificationSettings(session.id)
  );

  const updateReminder = useCallback(
    (
      id: NotificationReminderId,
      patch: Partial<NotificationReminderPreference>
    ) => {
      setSettings((current) => {
        const next = {
          ...current,
          [id]: {
            ...current[id],
            ...patch,
          },
        };

        saveNotificationSettings(session.id, next);
        void placeholderNotificationService.syncSchedules(next);

        return next;
      });
    },
    [session.id]
  );

  return {
    settings,
    updateReminder,
    permissionState: placeholderNotificationService.getPermissionState(),
    requestPermission: placeholderNotificationService.requestPermission,
  };
}
