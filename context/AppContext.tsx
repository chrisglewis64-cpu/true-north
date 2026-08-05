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
import type { DebriefSubmission } from "@/lib/debrief-form";
import type { AppContextValue } from "@/types/app";

const AppContext = createContext<AppContextValue | null>(null);

function loadInitialState() {
  const defaults = createInitialAppState();

  if (typeof window === "undefined") {
    return defaults;
  }

  const session = getDailySession();
  const debriefHistory = readDebriefHistory();

  return {
    ...defaults,
    todaysCommitment: session.todaysCommitment || defaults.todaysCommitment,
    todaysOnePercent: session.todaysOnePercent || defaults.todaysOnePercent,
    todaysDebrief: session.todaysDebrief,
    debriefHistory,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadInitialState);

  useEffect(() => {
    writeDebriefHistory(state.debriefHistory);
  }, [state.debriefHistory]);

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

  const setCurrentMission = useCallback(
    (value: AppContextValue["currentMission"]) => {
      setState((current) => ({ ...current, currentMission: value }));
    },
    []
  );

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

  const value: AppContextValue = {
    ...state,
    setTodaysCommitment,
    setTodaysOnePercent,
    setTodaysDebrief,
    setCurrentMission,
    completeMorningCommit,
    completeDebrief,
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
