import type { Mission } from "@/types/mission";
import type { AlignmentSignalResult } from "@/lib/compass/types";

const MISSION_STATUS_SCORES = {
  on_track: 92,
  at_risk: 68,
  off_course: 42,
  complete: 88,
} as const;

export function scoreMissionActivity(
  currentMission: Mission | null | undefined
): AlignmentSignalResult {
  if (!currentMission) {
    return { score: 70, available: false };
  }

  return {
    score: MISSION_STATUS_SCORES[currentMission.missionStatus],
    available: true,
  };
}
