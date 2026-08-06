import type { MissionStatus } from "@/types/mission";

export type MissionStatusOption = {
  value: MissionStatus;
  label: string;
  emoji: string;
  description: string;
};

export const MISSION_STATUS_OPTIONS: MissionStatusOption[] = [
  {
    value: "on_track",
    label: "On Track",
    emoji: "🟢",
    description: "Progress is being made consistently. No intervention required.",
  },
  {
    value: "at_risk",
    label: "At Risk",
    emoji: "🟡",
    description: "Progress has slowed. The mission requires attention.",
  },
  {
    value: "off_course",
    label: "Off Course",
    emoji: "🔴",
    description:
      "The mission has stalled. Immediate course correction is required.",
  },
  {
    value: "complete",
    label: "Complete",
    emoji: "⚪",
    description:
      "The mission has been successfully completed. It will move into Completed Missions.",
  },
];

export const DEFAULT_MISSION_STATUS: MissionStatus = "on_track";

export function getMissionStatusOption(
  status: MissionStatus
): MissionStatusOption {
  return (
    MISSION_STATUS_OPTIONS.find((option) => option.value === status) ??
    MISSION_STATUS_OPTIONS[0]
  );
}

export function formatMissionProgressStatus(status: MissionStatus): string {
  return getMissionStatusOption(status).label;
}

/**
 * Resolves the displayed mission status.
 * Completed lifecycle missions always show Complete.
 * Future: when statusSource is "calculated", run calculateMissionStatus(signals).
 */
export function resolveMissionProgressStatus(mission: {
  status: "active" | "upcoming" | "completed";
  missionStatus: MissionStatus;
  statusSource: "manual" | "calculated";
}): MissionStatus {
  if (mission.status === "completed") {
    return "complete";
  }

  if (mission.statusSource === "calculated") {
    // Future: return calculateMissionStatus(mission, signals);
    return mission.missionStatus;
  }

  return mission.missionStatus;
}

export function getMissionStatusBadgeClasses(status: MissionStatus): string {
  switch (status) {
    case "on_track":
      return "border-accent/40 bg-accent/10 text-accent";
    case "at_risk":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400/90";
    case "off_course":
      return "border-red-500/30 bg-red-500/10 text-red-400/90";
    case "complete":
      return "border-border-subtle bg-surface-elevated text-muted";
  }
}

export function getEditableMissionStatusOptions(
  includeComplete: boolean
): MissionStatusOption[] {
  if (includeComplete) {
    return MISSION_STATUS_OPTIONS;
  }

  return MISSION_STATUS_OPTIONS.filter((option) => option.value !== "complete");
}
