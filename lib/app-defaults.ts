import { mission, todaysOnePercent } from "@/lib/placeholder-data";
import type { AppState } from "@/types/app";

export function createInitialAppState(): AppState {
  return {
    todaysCommitment: "",
    todaysOnePercent: todaysOnePercent.improvement,
    todaysDebrief: null,
    debriefHistory: [],
    currentMission: {
      title: mission.title,
      purpose: mission.purpose,
      progress: mission.progress,
      nextAction: mission.nextAction,
      statement: mission.statement,
      roles: mission.roles,
    },
  };
}
