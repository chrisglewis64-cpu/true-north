"use client";

import { useCallback, useEffect, useState } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  fetchNotificationPreferences,
  saveNotificationPreferences,
} from "@/lib/database/profiles.repository";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications/defaults";
import {
  getNotificationPermissionMessage,
  getNotificationPermissionState,
  requestNotificationPermissionOnce,
  type NotificationPermissionState,
} from "@/lib/notifications/permission";
import {
  loadNotificationSettings,
  saveNotificationSettings,
} from "@/lib/notifications/storage";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  NotificationReminderId,
  NotificationReminderPreference,
  NotificationSettings,
} from "@/types/notifications";

function isAuthenticatedSession(sessionId: string): boolean {
  return sessionId !== "session-local";
}

function hasAnyReminderEnabled(settings: NotificationSettings): boolean {
  return Object.values(settings).some((reminder) => reminder.enabled);
}

export function useNotificationSettings() {
  const { session } = useTrueNorth();
  const [settings, setSettings] = useState<NotificationSettings>(() =>
    loadNotificationSettings(session.id)
  );
  const [isLoading, setIsLoading] = useState(
    () => isSupabaseConfigured() && isAuthenticatedSession(session.id)
  );
  const [saveError, setSaveError] = useState<string>();
  const [permissionState, setPermissionState] =
    useState<NotificationPermissionState>(() =>
      getNotificationPermissionState()
    );

  useEffect(() => {
    setPermissionState(getNotificationPermissionState());
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function restoreSettings() {
      const cached = loadNotificationSettings(session.id);
      setSettings(cached);

      if (!isSupabaseConfigured() || !isAuthenticatedSession(session.id)) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setSaveError(undefined);

      try {
        const supabase = createSupabaseBrowserClient();
        const remote = await fetchNotificationPreferences(
          supabase,
          session.id
        );
        if (cancelled) return;

        setSettings(remote);
        saveNotificationSettings(session.id, remote);
      } catch (error) {
        console.error("[Notifications] Failed to restore preferences:", error);
        if (!cancelled) {
          setSettings(cached);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void restoreSettings();

    return () => {
      cancelled = true;
    };
  }, [session.id]);

  const persistSettings = useCallback(
    async (next: NotificationSettings) => {
      saveNotificationSettings(session.id, next);

      if (!isSupabaseConfigured() || !isAuthenticatedSession(session.id)) {
        return;
      }

      try {
        const supabase = createSupabaseBrowserClient();
        await saveNotificationPreferences(supabase, session.id, next);
        setSaveError(undefined);
      } catch (error) {
        console.error("[Notifications] Failed to save preferences:", error);
        setSaveError("Unable to save notification preferences.");
      }
    },
    [session.id]
  );

  const updateReminder = useCallback(
    async (
      id: NotificationReminderId,
      patch: Partial<NotificationReminderPreference>
    ) => {
      const enabling =
        patch.enabled === true && !hasAnyReminderEnabled(settings);

      if (enabling) {
        const nextPermission = await requestNotificationPermissionOnce();
        setPermissionState(nextPermission);
      }

      setSettings((current) => {
        const next: NotificationSettings = {
          ...current,
          [id]: {
            ...current[id],
            ...patch,
          },
        };

        void persistSettings(next);
        return next;
      });
    },
    [persistSettings, settings]
  );

  return {
    settings: settings ?? DEFAULT_NOTIFICATION_SETTINGS,
    updateReminder,
    isLoading,
    saveError,
    permissionState,
    permissionMessage: getNotificationPermissionMessage(permissionState),
  };
}
