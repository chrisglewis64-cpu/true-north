"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createMissionUuid,
  loadTrueNorthState,
  missionsService,
  persistDailyDebrief,
  persistDailyOnePercent,
  persistMissionIntent,
} from "@/lib/database";
import { createInitialTrueNorthState } from "@/lib/true-north-defaults";
import {
  DEFAULT_MISSION_STATUS,
  resolveMissionProgressStatus,
} from "@/lib/mission-status";
import { getActiveMission, resolveNewMissionStatus } from "@/lib/mission-utils";
import {
  upsertDatedDebrief,
  upsertDatedMissionIntent,
} from "@/lib/compass/history";
import { getLocalDateString } from "@/lib/database/utils";
import { hasCompletedMorningCommit } from "@/lib/morning-flow/commit-state";
import {
  createLocalSessionSnapshot,
  saveLocalSessionSnapshot,
} from "@/lib/storage/local-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DailyDebriefDraft } from "@/types/daily-debrief";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { DailyOnePercent } from "@/types/one-percent";
import type { Mission, MissionInput } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { UserSession } from "@/types/session";
import type { TrueNorthContextValue } from "@/types/true-north";
import type { TrueNorthState } from "@/types/true-north";

const TrueNorthContext = createContext<TrueNorthContextValue | null>(null);

function isAuthenticatedSession(session: UserSession): boolean {
  return session.id !== "session-local";
}

export function TrueNorthProvider({ children }: { children: ReactNode }) {
  const initial = createInitialTrueNorthState();
  const supabaseEnabled = isSupabaseConfigured();
  const supabaseRef = useRef(
    supabaseEnabled ? createSupabaseBrowserClient() : null
  );
  const sessionRef = useRef(initial.session);

  const [myStandard, setMyStandard] = useState(initial.myStandard);
  const [todaysMissionIntent, setTodaysMissionIntentState] = useState(
    initial.todaysMissionIntent
  );
  const [todaysOnePercent, setTodaysOnePercentState] = useState(
    initial.todaysOnePercent
  );
  const [dailyDebriefSubmission, setDailyDebriefSubmissionState] = useState(
    initial.dailyDebrief.submission
  );
  const [dailyDebriefDraft, setDailyDebriefDraft] = useState(
    initial.dailyDebrief.draft
  );
  const [dailyDebriefHistory, setDailyDebriefHistory] = useState(
    initial.dailyDebriefHistory
  );
  const [missionIntentHistory, setMissionIntentHistory] = useState(
    initial.missionIntentHistory
  );
  const [weeklyReviews, setWeeklyReviews] = useState(initial.weeklyReviews);
  const [session, setSession] = useState(initial.session);
  const [missions, setMissions] = useState<Mission[]>(initial.missions);
  const [isHydrated, setIsHydrated] = useState(!supabaseEnabled);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const currentMission = useMemo(
    () => getActiveMission(missions) ?? null,
    [missions]
  );

  const currentMissionStatus = useMemo(
    () =>
      currentMission ? resolveMissionProgressStatus(currentMission) : null,
    [currentMission]
  );

  const morningCommitComplete = useMemo(
    () => hasCompletedMorningCommit(todaysMissionIntent, missionIntentHistory),
    [todaysMissionIntent, missionIntentHistory]
  );

  function persistLocalSession(
    next: Pick<
      TrueNorthState,
      "todaysMissionIntent" | "dailyDebriefHistory" | "missionIntentHistory"
    >
  ) {
    saveLocalSessionSnapshot(
      sessionRef.current.id,
      createLocalSessionSnapshot(next)
    );
  }

  useEffect(() => {
    if (!supabaseEnabled || !supabaseRef.current) {
      return;
    }

    const client = supabaseRef.current;
    let cancelled = false;

    async function hydrateFromSupabase() {
      try {
        const persisted = await loadTrueNorthState(client);
        if (cancelled) return;

        if (persisted) {
          sessionRef.current = persisted.session;
          setSession(persisted.session);
          setMissions(persisted.missions);
          setMyStandard(persisted.myStandard);
          setTodaysMissionIntentState(persisted.todaysMissionIntent);
          setTodaysOnePercentState(persisted.todaysOnePercent);
          setDailyDebriefSubmissionState(persisted.dailyDebrief.submission);
          setDailyDebriefDraft(persisted.dailyDebrief.draft);
          setDailyDebriefHistory(persisted.dailyDebriefHistory);
          setMissionIntentHistory(persisted.missionIntentHistory);
          setWeeklyReviews(persisted.weeklyReviews);
          persistLocalSession({
            todaysMissionIntent: persisted.todaysMissionIntent,
            dailyDebriefHistory: persisted.dailyDebriefHistory,
            missionIntentHistory: persisted.missionIntentHistory,
          });
        }
      } catch (error) {
        console.error("[TrueNorth] Failed to hydrate from Supabase:", error);
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    void hydrateFromSupabase();

    return () => {
      cancelled = true;
    };
  }, [supabaseEnabled]);

  function persistIfAuthenticated(task: (userId: string) => Promise<void>) {
    const activeSession = sessionRef.current;
    if (!supabaseRef.current || !isAuthenticatedSession(activeSession)) return;

    void task(activeSession.id).catch((error) => {
      console.error("[TrueNorth] Persistence failed:", error);
    });
  }

  function setTodaysMissionIntent(intent: MissionIntent) {
    const today = getLocalDateString();
    const nextHistory = upsertDatedMissionIntent(
      missionIntentHistory,
      today,
      intent
    );

    setTodaysMissionIntentState(intent);
    setMissionIntentHistory(nextHistory);
    persistLocalSession({
      todaysMissionIntent: intent,
      dailyDebriefHistory,
      missionIntentHistory: nextHistory,
    });
    persistIfAuthenticated((userId) =>
      persistMissionIntent(supabaseRef.current!, userId, intent)
    );
  }

  function setTodaysOnePercent(value: DailyOnePercent) {
    setTodaysOnePercentState(value);
    persistIfAuthenticated((userId) =>
      persistDailyOnePercent(supabaseRef.current!, userId, value)
    );
  }

  function setDailyDebriefSubmission(value: DailyDebrief | null) {
    const today = getLocalDateString();
    setDailyDebriefSubmissionState(value);
    if (value) {
      const nextHistory = upsertDatedDebrief(dailyDebriefHistory, today, value);
      setDailyDebriefHistory(nextHistory);
      persistLocalSession({
        todaysMissionIntent,
        dailyDebriefHistory: nextHistory,
        missionIntentHistory,
      });
      persistIfAuthenticated((userId) =>
        persistDailyDebrief(supabaseRef.current!, userId, value)
      );
    }
  }

  function updateDailyDebriefDraft(partial: Partial<DailyDebriefDraft>) {
    setDailyDebriefDraft((current) => {
      if (!current) return current;
      return { ...current, ...partial };
    });
  }

  function getMissionById(id: string): Mission | undefined {
    return missions.find((mission) => mission.id === id);
  }

  function createMission(input: MissionInput) {
    setMissions((current) => {
      const now = new Date().toISOString();
      const newMission: Mission = {
        id: createMissionUuid(),
        ...input,
        status: resolveNewMissionStatus(current),
        missionStatus: input.missionStatus ?? DEFAULT_MISSION_STATUS,
        statusSource: "manual",
        statusUpdatedAt: now,
        lessonsLearned: "",
        createdAt: now,
        completedAt: null,
      };

      persistIfAuthenticated(async (userId) => {
        await missionsService.create(supabaseRef.current!, userId, newMission);
      });

      return [...current, newMission];
    });
  }

  function updateMission(id: string, input: MissionInput) {
    setMissions((current) =>
      current.map((mission) => {
        if (mission.id !== id || mission.status === "completed") {
          return mission;
        }
        const now = new Date().toISOString();
        return {
          ...mission,
          ...input,
          statusSource: "manual" as const,
          statusUpdatedAt: now,
        };
      })
    );

    persistIfAuthenticated(() =>
      missionsService.update(supabaseRef.current!, id, input)
    );
  }

  function completeMission(id: string, lessonsLearned: string) {
    setMissions((current) =>
      current.map((mission) => {
        if (mission.id !== id || mission.status !== "active") {
          return mission;
        }
        const now = new Date().toISOString();
        return {
          ...mission,
          status: "completed",
          missionStatus: "complete",
          statusSource: "manual",
          statusUpdatedAt: now,
          lessonsLearned,
          completedAt: now,
        };
      })
    );

    persistIfAuthenticated(() =>
      missionsService.complete(supabaseRef.current!, id, lessonsLearned)
    );
  }

  const value: TrueNorthContextValue = {
    myStandard,
    todaysMissionIntent,
    todaysOnePercent,
    dailyDebrief: {
      submission: dailyDebriefSubmission,
      draft: dailyDebriefDraft,
    },
    dailyDebriefHistory,
    missionIntentHistory,
    weeklyReviews,
    session,
    missions,
    currentMission,
    currentMissionStatus,
    hasCompletedMorningCommit: morningCommitComplete,
    setTodaysMissionIntent,
    setTodaysOnePercent,
    setDailyDebriefSubmission,
    setDailyDebriefDraft,
    updateDailyDebriefDraft,
    createMission,
    updateMission,
    completeMission,
    getMissionById,
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <TrueNorthContext.Provider value={value}>{children}</TrueNorthContext.Provider>
  );
}

export function useTrueNorth(): TrueNorthContextValue {
  const context = useContext(TrueNorthContext);
  if (!context) {
    throw new Error("useTrueNorth must be used within TrueNorthProvider");
  }
  return context;
}
