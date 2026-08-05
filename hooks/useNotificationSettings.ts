"use client";

import { useCallback, useEffect, useState } from "react";
import {
  applyFrequencyChange,
  createDefaultNotificationSettings,
} from "@/lib/notifications/default-settings";
import type {
  NotificationFrequency,
  NotificationReminder,
  NotificationReminderId,
  NotificationSettings,
} from "@/types/notifications";

const STORAGE_KEY = "true-north:notification-settings";

function readStoredSettings(): NotificationSettings | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as NotificationSettings;
  } catch {
    return null;
  }
}

function writeStoredSettings(settings: NotificationSettings): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function loadInitialSettings(): NotificationSettings {
  return readStoredSettings() ?? createDefaultNotificationSettings();
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(loadInitialSettings);

  useEffect(() => {
    writeStoredSettings(settings);
  }, [settings]);

  const updateReminder = useCallback(
    (
      id: NotificationReminderId,
      updater: (current: NotificationReminder) => NotificationReminder
    ) => {
      setSettings((current) => ({
        reminders: current.reminders.map((reminder) =>
          reminder.id === id ? updater(reminder) : reminder
        ),
      }));
    },
    []
  );

  const setEnabled = useCallback(
    (id: NotificationReminderId, enabled: boolean) => {
      updateReminder(id, (reminder) => ({ ...reminder, enabled }));
    },
    [updateReminder]
  );

  const setFrequency = useCallback(
    (id: NotificationReminderId, frequency: NotificationFrequency) => {
      updateReminder(id, (reminder) => applyFrequencyChange(reminder, frequency));
    },
    [updateReminder]
  );

  const updateSchedule = useCallback(
    (id: NotificationReminderId, schedule: NotificationReminder["schedule"]) => {
      updateReminder(id, (reminder) => {
        if (reminder.frequency === "custom") {
          return { ...reminder, schedule: {} };
        }

        return { ...reminder, schedule } as NotificationReminder;
      });
    },
    [updateReminder]
  );

  return {
    settings,
    setEnabled,
    setFrequency,
    updateSchedule,
  };
}
