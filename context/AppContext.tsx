"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createInitialAppState } from "@/lib/app-defaults";
import type { AppContextValue } from "@/types/app";

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = createInitialAppState();

  const [todaysCommitment, setTodaysCommitment] = useState(
    initial.todaysCommitment
  );
  const [todaysOnePercent, setTodaysOnePercent] = useState(
    initial.todaysOnePercent
  );
  const [todaysDebrief, setTodaysDebrief] = useState(initial.todaysDebrief);
  const [currentMission, setCurrentMission] = useState(initial.currentMission);

  const value: AppContextValue = {
    todaysCommitment,
    todaysOnePercent,
    todaysDebrief,
    currentMission,
    setTodaysCommitment,
    setTodaysOnePercent,
    setTodaysDebrief,
    setCurrentMission,
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
