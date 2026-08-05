import { createMissionFromDraft } from "@/lib/missions/default-missions";
import type { Mission, MissionDraft } from "@/types/mission";

function sortUpcoming(missions: Mission[]): Mission[] {
  return [...missions].sort((left, right) => left.sortOrder - right.sortOrder);
}

export function getActiveMission(
  missions: readonly Mission[]
): Mission | undefined {
  return missions.find((mission) => mission.lifecycleStatus === "active");
}

export function getUpcomingMissions(
  missions: readonly Mission[]
): Mission[] {
  return sortUpcoming(
    missions.filter((mission) => mission.lifecycleStatus === "upcoming")
  );
}

export function getCompletedMissions(
  missions: readonly Mission[]
): Mission[] {
  return missions
    .filter((mission) => mission.lifecycleStatus === "completed")
    .sort((left, right) =>
      (right.completedAt ?? "").localeCompare(left.completedAt ?? "")
    );
}

export function createUpcomingMission(
  missions: Mission[],
  draft: MissionDraft
): Mission[] {
  const upcoming = getUpcomingMissions(missions);
  const nextOrder =
    upcoming.length > 0
      ? Math.max(...upcoming.map((mission) => mission.sortOrder)) + 1
      : 0;

  return [
    ...missions,
    createMissionFromDraft(draft, "upcoming", nextOrder),
  ];
}

export function updateMissionRecord(
  missions: Mission[],
  id: string,
  patch: Partial<Mission>
): Mission[] {
  return missions.map((mission) =>
    mission.id === id
      ? { ...mission, ...patch, updatedAt: new Date().toISOString() }
      : mission
  );
}

export function deleteMissionRecord(
  missions: Mission[],
  id: string
): Mission[] {
  return missions.filter((mission) => mission.id !== id);
}

export function reorderUpcomingMissions(
  missions: Mission[],
  orderedIds: string[]
): Mission[] {
  return missions.map((mission) => {
    if (mission.lifecycleStatus !== "upcoming") {
      return mission;
    }

    const nextIndex = orderedIds.indexOf(mission.id);
    if (nextIndex === -1) {
      return mission;
    }

    return {
      ...mission,
      sortOrder: nextIndex,
      updatedAt: new Date().toISOString(),
    };
  });
}

export function moveUpcomingMission(
  missions: Mission[],
  id: string,
  direction: "up" | "down"
): Mission[] {
  const upcoming = getUpcomingMissions(missions);
  const index = upcoming.findIndex((mission) => mission.id === id);

  if (index === -1) {
    return missions;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= upcoming.length) {
    return missions;
  }

  const reordered = [...upcoming];
  [reordered[index], reordered[targetIndex]] = [
    reordered[targetIndex],
    reordered[index],
  ];

  return reorderUpcomingMissions(
    missions,
    reordered.map((mission) => mission.id)
  );
}

export function completeMissionRecord(
  missions: Mission[],
  id: string,
  missionReview: string
): Mission[] {
  const timestamp = new Date().toISOString();

  return missions.map((mission) =>
    mission.id === id
      ? {
          ...mission,
          lifecycleStatus: "completed",
          missionReview,
          completedAt: timestamp,
          updatedAt: timestamp,
        }
      : mission
  );
}

export function startMissionRecord(
  missions: Mission[],
  id: string,
  missionReviewForPrevious = "Mission completed when the next mission began."
): Mission[] {
  const active = getActiveMission(missions);
  let next = missions;

  if (active && active.id !== id) {
    next = completeMissionRecord(next, active.id, missionReviewForPrevious);
  }

  return next.map((mission) => {
    if (mission.id === id) {
      return {
        ...mission,
        lifecycleStatus: "active",
        missionStatus: mission.missionStatus || "Active",
        updatedAt: new Date().toISOString(),
      };
    }

    return mission;
  });
}
