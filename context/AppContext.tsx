"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createInitialAppState } from "@/lib/app-defaults";
import {
  completeMissionRecord,
  createUpcomingMission,
  deleteMissionRecord,
  moveUpcomingMission,
  startMissionRecord,
  updateMissionRecord,
} from "@/lib/missions/mission-actions";
import {
  getDailySession,
  markMorningCommitComplete,
  updateDailySession,
} from "@/lib/morning-flow/commit-state";
import {
  getCalendarDateKey,
  readDebriefHistory,
  writeDebriefHistory,
  type DebriefRecord,
} from "@/lib/storage/local-session";
import {
  readMissions,
  writeMissions,
} from "@/lib/storage/mission-store";
import type { DebriefSubmission } from "@/lib/debrief-form";
import type { MissionDraft } from "@/types/mission";
import type { AppContextValue } from "@/types/app";

const AppContext = createContext<AppContextValue | null>(null);

function loadInitialState() {
  const defaults = createInitialAppState();

  if (typeof window === "undefined") {
    return defaults;
  }

  const session = getDailySession();
  const debriefHistory = readDebriefHistory();
  const storedMissions = readMissions();

  return {
    ...defaults,
    todaysCommitment: session.todaysCommitment || defaults.todaysCommitment,
    todaysOnePercent: session.todaysOnePercent || defaults.todaysOnePercent,
    todaysDebrief: session.todaysDebrief,
    debriefHistory,
    missions: storedMissions.length > 0 ? storedMissions : defaults.missions,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    writeDebriefHistory(state.debriefHistory);
  }, [state.debriefHistory]);

  useEffect(() => {
    writeMissions(state.missions);
  }, [state.missions]);

  const setTodaysCommitment = useCallback((value: string) => {
    setState((current) => {
      updateDailySession({ todaysCommitment: value });
      return { ...current, todaysCommitment: value };
    });
  }, []);

  const setTodaysOnePercent = useCallback((value: string) => {
    setState((current) => {
      updateDailySession({ todaysOnePercent: value });
      return { ...current, todaysOnePercent: value };
    });
  }, []);

  const setTodaysDebrief = useCallback((value: DebriefSubmission | null) => {
    setState((current) => {
      updateDailySession({ todaysDebrief: value });
      return { ...current, todaysDebrief: value };
    });
  }, []);

  const completeMorningCommit = useCallback((commitment: string) => {
    markMorningCommitComplete(commitment);
    setState((current) => ({
      ...current,
      todaysCommitment: commitment,
    }));
  }, []);

  const completeDebrief = useCallback((debrief: DebriefSubmission) => {
    const record: DebriefRecord = {
      ...debrief,
      date: getCalendarDateKey(),
      completedAt: new Date().toISOString(),
    };

    setState((current) => {
      const debriefHistory = [
        record,
        ...current.debriefHistory.filter((entry) => entry.date !== record.date),
      ];

      updateDailySession({
        todaysDebrief: debrief,
        todaysOnePercent: debrief.tomorrowOnePercent,
      });

      return {
        ...current,
        todaysDebrief: debrief,
        todaysOnePercent: debrief.tomorrowOnePercent,
        debriefHistory,
      };
    });
  }, []);

  const createMission = useCallback((draft: MissionDraft) => {
    setState((current) => ({
      ...current,
      missions: createUpcomingMission(current.missions, draft),
    }));
  }, []);

  const updateMission = useCallback((id: string, draft: MissionDraft) => {
    setState((current) => ({
      ...current,
      missions: updateMissionRecord(current.missions, id, draft),
    }));
  }, []);

  const deleteMission = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      missions: deleteMissionRecord(current.missions, id),
    }));
  }, []);

  const reorderUpcomingMission = useCallback(
    (id: string, direction: "up" | "down") => {
      setState((current) => ({
        ...current,
        missions: moveUpcomingMission(current.missions, id, direction),
      }));
    },
    []
  );

  const startMission = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      missions: startMissionRecord(current.missions, id),
    }));
  }, []);

  const completeMission = useCallback((id: string, missionReview: string) => {
    setState((current) => ({
      ...current,
      missions: completeMissionRecord(current.missions, id, missionReview),
    }));
  }, []);

  const getMissionById = useCallback(
    (id: string) => state.missions.find((mission) => mission.id === id),
    [state.missions]
  );

  const value: AppContextValue = {
    ...state,
    setTodaysCommitment,
    setTodaysOnePercent,
    setTodaysDebrief,
    completeMorningCommit,
    completeDebrief,
    createMission,
    updateMission,
    deleteMission,
    reorderUpcomingMission,
    startMission,
    completeMission,
    getMissionById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
