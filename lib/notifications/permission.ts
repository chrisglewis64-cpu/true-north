export type NotificationPermissionState =
  | "granted"
  | "denied"
  | "default"
  | "unsupported";

const PERMISSION_ASKED_KEY = "true-north:notifications:permission-asked";

export function getNotificationPermissionState(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  return Notification.permission;
}

export function hasAskedNotificationPermission(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(PERMISSION_ASKED_KEY) === "1";
}

function markNotificationPermissionAsked(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PERMISSION_ASKED_KEY, "1");
}

/**
 * Requests browser notification permission the first time the user enables
 * a reminder. Subsequent enables do not prompt again.
 */
export async function requestNotificationPermissionOnce(): Promise<NotificationPermissionState> {
  const current = getNotificationPermissionState();

  if (current === "unsupported") {
    markNotificationPermissionAsked();
    return current;
  }

  if (hasAskedNotificationPermission()) {
    return current;
  }

  markNotificationPermissionAsked();

  if (current !== "default") {
    return current;
  }

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch {
    return getNotificationPermissionState();
  }
}

export function getNotificationPermissionMessage(
  state: NotificationPermissionState
): string | undefined {
  if (state === "denied") {
    return "Reminders cannot be delivered until notification permission is enabled in your browser settings.";
  }

  if (state === "unsupported") {
    return "This browser does not support notifications, so reminders cannot be delivered here.";
  }

  return undefined;
}
