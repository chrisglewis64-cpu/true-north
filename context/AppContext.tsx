"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { createInitialAppState } from "@/lib/app-defaults";
import {
  fetchDebriefHistory,
  fetchTodaysDebrief,
  fetchTomorrowOnePercent,
  upsertDebrief,
} from "@/lib/data/debriefs";
import {
  fetchTodaysIntent,
  upsertMissionIntent,
} from "@/lib/data/mission-intents";
import {
  completeMission as completeMissionRemote,
  createActiveMission as createActiveMissionRemote,
  createMission as createMissionRemote,
  deleteMission as deleteMissionRemote,
  fetchMissions,
  reorderMission,
  startMission as startMissionRemote,
  updateMission as updateMissionRemote,
} from "@/lib/data/missions";
import type { DebriefSubmission } from "@/lib/debrief-form";
import type { MissionDraft } from "@/types/mission";
import type { AppContextValue, AppState } from "@/types/app";

const AppContext = createContext<AppContextValue | null>(null);

const initialState: AppState = {
  ...createInitialAppState(),
  isReady: false,
  morningCommitCompleted: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    let cancelled = false;

    async function loadUserData() {
      if (!user) {
        setState({ ...initialState, isReady: true });
        return;
      }

      setState((current) => ({ ...current, isReady: false }));

      try {
        const [
          missions,
          debriefHistory,
          todaysCommitment,
          todaysDebrief,
          todaysOnePercent,
        ] = await Promise.all([
          fetchMissions(supabase, user.id),
          fetchDebriefHistory(supabase, user.id),
          fetchTodaysIntent(supabase, user.id),
          fetchTodaysDebrief(supabase, user.id),
          fetchTomorrowOnePercent(supabase, user.id),
        ]);

        if (cancelled) {
          return;
        }

        setState({
          isReady: true,
          morningCommitCompleted: Boolean(todaysCommitment?.trim()),
          todaysCommitment: todaysCommitment ?? "",
          todaysOnePercent,
          todaysDebrief,
          debriefHistory,
          missions,
        });
      } catch {
        if (!cancelled) {
          setState({ ...initialState, isReady: true });
        }
      }
    }

    void loadUserData();

    return () => {
      cancelled = true;
    };
  }, [supabase, user]);

  const setTodaysCommitment = useCallback((value: string) => {
    setState((current) => ({ ...current, todaysCommitment: value }));
  }, []);

  const setTodaysOnePercent = useCallback((value: string) => {
    setState((current) => ({ ...current, todaysOnePercent: value }));
  }, []);

  const setTodaysDebrief = useCallback((value: DebriefSubmission | null) => {
    setState((current) => ({ ...current, todaysDebrief: value }));
  }, []);

  const completeMorningCommit = useCallback(
    async (commitment: string) => {
      if (!user) {
        return;
      }

      await upsertMissionIntent(supabase, user.id, commitment);

      setState((current) => ({
        ...current,
        morningCommitCompleted: true,
        todaysCommitment: commitment,
      }));
    },
    [supabase, user],
  );

  const completeDebrief = useCallback(
    async (debrief: DebriefSubmission) => {
      if (!user) {
        return;
      }

      const record = await upsertDebrief(supabase, user.id, debrief);

      setState((current) => ({
        ...current,
        todaysDebrief: debrief,
        todaysOnePercent: debrief.tomorrowOnePercent,
        debriefHistory: [
          record,
          ...current.debriefHistory.filter((entry) => entry.date !== record.date),
        ],
      }));
    },
    [supabase, user],
  );

  const createMission = useCallback(
    async (draft: MissionDraft) => {
      if (!user) {
        return;
      }

      const missions = await createMissionRemote(
        supabase,
        user.id,
        state.missions,
        draft,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const createActiveMission = useCallback(
    async (draft: MissionDraft) => {
      if (!user) {
        return;
      }

      const missions = await createActiveMissionRemote(
        supabase,
        user.id,
        draft,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user],
  );

  const updateMission = useCallback(
    async (id: string, draft: MissionDraft) => {
      if (!user) {
        return;
      }

      const missions = await updateMissionRemote(
        supabase,
        user.id,
        state.missions,
        id,
        draft,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const deleteMission = useCallback(
    async (id: string) => {
      if (!user) {
        return;
      }

      const missions = await deleteMissionRemote(
        supabase,
        user.id,
        state.missions,
        id,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const reorderUpcomingMission = useCallback(
    async (id: string, direction: "up" | "down") => {
      if (!user) {
        return;
      }

      const missions = await reorderMission(
        supabase,
        user.id,
        state.missions,
        id,
        direction,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const startMission = useCallback(
    async (id: string) => {
      if (!user) {
        return;
      }

      const missions = await startMissionRemote(
        supabase,
        user.id,
        state.missions,
        id,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const completeMission = useCallback(
    async (id: string, missionReview: string) => {
      if (!user) {
        return;
      }

      const missions = await completeMissionRemote(
        supabase,
        user.id,
        state.missions,
        id,
        missionReview,
      );
      setState((current) => ({ ...current, missions }));
    },
    [supabase, user, state.missions],
  );

  const getMissionById = useCallback(
    (id: string) => state.missions.find((mission) => mission.id === id),
    [state.missions],
  );

  const value: AppContextValue = {
    ...state,
    setTodaysCommitment,
    setTodaysOnePercent,
    setTodaysDebrief,
    completeMorningCommit,
    completeDebrief,
    createMission,
    createActiveMission,
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
