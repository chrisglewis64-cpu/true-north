import type { Mission, MissionLifecycle } from "@/types/mission";

export function getActiveMission(missions: Mission[]): Mission | undefined {
  return missions.find((mission) => mission.status === "active");
}

export function getUpcomingMissions(missions: Mission[]): Mission[] {
  return missions.filter((mission) => mission.status === "upcoming");
}

export function getCompletedMissions(missions: Mission[]): Mission[] {
  return missions.filter((mission) => mission.status === "completed");
}

export function hasActiveMission(missions: Mission[]): boolean {
  return missions.some((mission) => mission.status === "active");
}

export function resolveNewMissionStatus(missions: Mission[]): MissionLifecycle {
  return hasActiveMission(missions) ? "upcoming" : "active";
}
