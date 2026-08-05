import { createDefaultMissions } from "@/lib/missions/default-missions";
import { todaysOnePercent } from "@/lib/placeholder-data";
import type { AppState } from "@/types/app";

export function createInitialAppState(): AppState {
  return {
    todaysCommitment: "",
    todaysOnePercent: todaysOnePercent.improvement,
    todaysDebrief: null,
    debriefHistory: [],
    missions: createDefaultMissions(),
  };
}
