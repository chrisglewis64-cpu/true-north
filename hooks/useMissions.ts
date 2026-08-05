"use client";

import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import {
  getActiveMission,
  getCompletedMissions,
  getUpcomingMissions,
} from "@/lib/missions/mission-actions";

export function useMissions() {
  const {
    missions,
    createMission,
    updateMission,
    deleteMission,
    reorderUpcomingMission,
    startMission,
    completeMission,
    getMissionById,
  } = useApp();

  return useMemo(
    () => ({
      missions,
      activeMission: getActiveMission(missions),
      upcomingMissions: getUpcomingMissions(missions),
      completedMissions: getCompletedMissions(missions),
      createMission,
      updateMission,
      deleteMission,
      reorderUpcomingMission,
      startMission,
      completeMission,
      getMissionById,
    }),
    [
      missions,
      createMission,
      updateMission,
      deleteMission,
      reorderUpcomingMission,
      startMission,
      completeMission,
      getMissionById,
    ]
  );
}
