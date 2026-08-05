import { mission as placeholderMission } from "@/lib/placeholder-data";
import type { Mission, MissionDraft } from "@/types/mission";

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `mission-${Date.now()}`;
}

export function createMissionFromDraft(
  draft: MissionDraft,
  lifecycleStatus: Mission["lifecycleStatus"],
  sortOrder: number
): Mission {
  const timestamp = new Date().toISOString();

  return {
    id: createId(),
    ...draft,
    lifecycleStatus,
    sortOrder,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createDefaultMissions(): Mission[] {
  const timestamp = new Date().toISOString();

  return [
    {
      id: createId(),
      name: placeholderMission.title,
      purpose: placeholderMission.purpose,
      successCriteria:
        "Home routines are consistent, family connection is protected daily, and I finish what I start.",
      missionStatus: placeholderMission.progress,
      nextMilestone: placeholderMission.nextAction,
      lifecycleStatus: "active",
      sortOrder: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: createId(),
      name: "Build Physical Discipline",
      purpose: "Establish a sustainable training rhythm that supports energy and focus.",
      successCriteria:
        "Train four days per week for eight weeks without missing two consecutive weeks.",
      missionStatus: "Queued",
      nextMilestone: "Define weekly training blocks and start date.",
      lifecycleStatus: "upcoming",
      sortOrder: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}
