import { todaysOnePercent } from "@/lib/placeholder-data";
import type { AppState } from "@/types/app";

export function createInitialAppState(): Pick<
  AppState,
  | "todaysCommitment"
  | "todaysOnePercent"
  | "todaysDebrief"
  | "debriefHistory"
  | "missions"
> {
  return {
    todaysCommitment: "",
    todaysOnePercent: todaysOnePercent.improvement,
    todaysDebrief: null,
    debriefHistory: [],
    missions: [],
  };
}
