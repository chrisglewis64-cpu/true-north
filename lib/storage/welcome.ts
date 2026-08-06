const STORAGE_PREFIX = "true-north:welcome-seen";

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}:${userId}`;
}

export function hasSeenWelcome(userId: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(storageKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function markWelcomeSeen(userId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey(userId), "1");
  } catch {
    // Ignore quota / private mode failures — welcome may reappear once.
  }
}
