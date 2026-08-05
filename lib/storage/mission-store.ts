import type { Mission } from "@/types/mission";

const MISSIONS_KEY = "true-north:missions";

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function readMissions(): Mission[] {
  return readJson<Mission[]>(MISSIONS_KEY) ?? [];
}

export function writeMissions(missions: Mission[]): void {
  writeJson(MISSIONS_KEY, missions);
}
