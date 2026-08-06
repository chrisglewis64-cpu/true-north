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
  persistWeeklyBearings,
  markWelcomeComplete as persistWelcomeComplete,
  markStandardsComplete as persistStandardsComplete,
  markMissionStageComplete as persistMissionStageComplete,
  markOnboardingComplete as persistOnboardingComplete,
  replaceStandards,
} from "@/lib/database";
import { EMPTY_ONBOARDING_PROGRESS } from "@/lib/onboarding/stages";
import { ensureWeeklyBearings } from "@/lib/bearings/ensure-weekly";
import {
  createInitialTrueNorthState,
} from "@/lib/true-north-defaults";
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
import { evidenceEntriesFromDebrief } from "@/lib/evidence/from-debrief";
import { buildEvidenceEntriesFromDebriefs } from "@/lib/evidence/build-evidence-entries";
import { hasCompletedMorningCommit } from "@/lib/morning-flow/commit-state";
import {
  createLocalSessionSnapshot,
  mergeLocalSessionIntoState,
  saveLocalSessionSnapshot,
} from "@/lib/storage/local-session";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { WeeklyBearings } from "@/types/bearing";
import type { DailyDebriefDraft } from "@/types/daily-debrief";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { DailyOnePercent } from "@/types/one-percent";
import type { Mission, MissionInput } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { Standard } from "@/types/standard";
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

  const [myStandard, setMyStandardState] = useState(initial.myStandard);
  const [todaysMissionIntent, setTodaysMissionIntentState] = useState(
    initial.todaysMissionIntent
  );
  const [todaysOnePercent, setTodaysOnePercentState] = useState(
    initial.todaysOnePercent
  );
  const [weeklyBearings, setWeeklyBearingsState] = useState(
    initial.weeklyBearings
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Local mode: merge localStorage after mount to avoid SSR hydration mismatch.
  useEffect(() => {
    if (supabaseEnabled) {
      return;
    }

    const merged = mergeLocalSessionIntoState(createInitialTrueNorthState());
    sessionRef.current = merged.session;
    setSession(merged.session);
    setMissions(merged.missions);
    setMyStandardState(merged.myStandard);
    setTodaysMissionIntentState(merged.todaysMissionIntent);
    setTodaysOnePercentState(merged.todaysOnePercent);
    setWeeklyBearingsState(merged.weeklyBearings);
    setDailyDebriefSubmissionState(merged.dailyDebrief.submission);
    setDailyDebriefDraft(merged.dailyDebrief.draft);
    setDailyDebriefHistory(merged.dailyDebriefHistory);
    setMissionIntentHistory(merged.missionIntentHistory);
    setWeeklyReviews(merged.weeklyReviews);
    setIsHydrated(true);
  }, [supabaseEnabled]);

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

  const onboardingComplete = Boolean(session.onboardingCompletedAt);

  function persistLocalSession(
    next: Pick<
      TrueNorthState,
      | "todaysMissionIntent"
      | "dailyDebriefHistory"
      | "missionIntentHistory"
      | "weeklyBearings"
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
          setMyStandardState(persisted.myStandard);
          setTodaysMissionIntentState(persisted.todaysMissionIntent);
          setTodaysOnePercentState(persisted.todaysOnePercent);
          setWeeklyBearingsState(persisted.weeklyBearings);
          setDailyDebriefSubmissionState(persisted.dailyDebrief.submission);
          setDailyDebriefDraft(persisted.dailyDebrief.draft);
          setDailyDebriefHistory(persisted.dailyDebriefHistory);
          setMissionIntentHistory(persisted.missionIntentHistory);
          setWeeklyReviews(persisted.weeklyReviews);
          persistLocalSession({
            todaysMissionIntent: persisted.todaysMissionIntent,
            dailyDebriefHistory: persisted.dailyDebriefHistory,
            missionIntentHistory: persisted.missionIntentHistory,
            weeklyBearings: persisted.weeklyBearings,
          });
        }
      } catch (error) {
        console.error("[TrueNorth] Failed to hydrate from Supabase:", error);
      } finally {
        if (!cancelled) setIsHydrated(true);
      }
    }

    void hydrateFromSupabase();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        void hydrateFromSupabase();
      }
      if (event === "SIGNED_OUT") {
        const defaults = createInitialTrueNorthState();
        sessionRef.current = defaults.session;
        setSession(defaults.session);
        setMissions(defaults.missions);
        setMyStandardState(defaults.myStandard);
        setTodaysMissionIntentState(null);
        setWeeklyBearingsState(null);
        setDailyDebriefSubmissionState(null);
        setDailyDebriefDraft(null);
        setDailyDebriefHistory([]);
        setMissionIntentHistory([]);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabaseEnabled]);

  function persistIfAuthenticated(task: (userId: string) => Promise<void>) {
    const activeSession = sessionRef.current;
    if (!supabaseRef.current || !isAuthenticatedSession(activeSession)) return;

    void task(activeSession.id).catch((error) => {
      console.error("[TrueNorth] Persistence failed:", error);
    });
  }

  async function persistAuthenticated(
    task: (userId: string) => Promise<void>
  ): Promise<void> {
    const activeSession = sessionRef.current;
    if (!supabaseRef.current || !isAuthenticatedSession(activeSession)) {
      return;
    }

    await task(activeSession.id);
  }

  async function setMyStandard(standards: Standard[]) {
    const normalized = standards.map((standard, index) => ({
      ...standard,
      order: index + 1,
      statement: standard.statement.trim(),
    }));
    setMyStandardState(normalized);

    await persistAuthenticated(async (userId) => {
      const saved = await replaceStandards(
        supabaseRef.current!,
        userId,
        normalized
      );
      setMyStandardState(saved);
    });
  }

  function patchOnboarding(
    partial: Partial<typeof EMPTY_ONBOARDING_PROGRESS>
  ) {
    setSession((current) => {
      const onboarding = { ...current.onboarding, ...partial };
      const next = {
        ...current,
        onboarding,
        onboardingCompletedAt: onboarding.onboardingCompletedAt,
      };
      sessionRef.current = next;
      return next;
    });
  }

  async function markWelcomeComplete() {
    const completedAt = new Date().toISOString();
    patchOnboarding({ welcomeCompletedAt: completedAt });
    await persistAuthenticated((userId) =>
      persistWelcomeComplete(supabaseRef.current!, userId, completedAt)
    );
  }

  async function markStandardsComplete() {
    const completedAt = new Date().toISOString();
    patchOnboarding({ standardsCompletedAt: completedAt });
    await persistAuthenticated((userId) =>
      persistStandardsComplete(supabaseRef.current!, userId, completedAt)
    );
  }

  async function markMissionStageComplete() {
    const completedAt = new Date().toISOString();
    patchOnboarding({ missionCompletedAt: completedAt });
    await persistAuthenticated((userId) =>
      persistMissionStageComplete(supabaseRef.current!, userId, completedAt)
    );
  }

  async function markOnboardingComplete() {
    const completedAt = new Date().toISOString();
    patchOnboarding({
      welcomeCompletedAt: completedAt,
      standardsCompletedAt: completedAt,
      missionCompletedAt: completedAt,
      onboardingCompletedAt: completedAt,
    });

    await persistAuthenticated((userId) =>
      persistOnboardingComplete(supabaseRef.current!, userId, completedAt)
    );
  }

  async function setTodaysMissionIntent(intent: MissionIntent) {
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
      weeklyBearings,
    });

    await persistAuthenticated((userId) =>
      persistMissionIntent(supabaseRef.current!, userId, intent)
    );
  }

  function setTodaysOnePercent(value: DailyOnePercent) {
    setTodaysOnePercentState(value);
    persistIfAuthenticated((userId) =>
      persistDailyOnePercent(supabaseRef.current!, userId, value)
    );
  }

  function setWeeklyBearings(value: WeeklyBearings) {
    setWeeklyBearingsState(value);
    persistLocalSession({
      todaysMissionIntent,
      dailyDebriefHistory,
      missionIntentHistory,
      weeklyBearings: value,
    });
    persistIfAuthenticated((userId) =>
      persistWeeklyBearings(supabaseRef.current!, userId, value).catch(
        (error) => {
          console.error("[TrueNorth] Weekly bearings persist failed:", error);
        }
      )
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
        weeklyBearings,
      });

      const missionReference =
        currentMission?.name ?? todaysMissionIntent?.commitment ?? null;
      const evidenceEntries = evidenceEntriesFromDebrief(value, {
        debriefDate: today,
        missionReference,
      });

      persistIfAuthenticated((userId) =>
        persistDailyDebrief(
          supabaseRef.current!,
          userId,
          value,
          evidenceEntries
        )
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

  async function createMission(input: MissionInput) {
    const now = new Date().toISOString();
    let created: Mission | null = null;

    setMissions((current) => {
      const newMission: Mission = {
        id: createMissionUuid(),
        ...input,
        category: input.category || "",
        status: resolveNewMissionStatus(current),
        missionStatus: input.missionStatus ?? DEFAULT_MISSION_STATUS,
        statusSource: "manual",
        statusUpdatedAt: now,
        lessonsLearned: "",
        createdAt: now,
        completedAt: null,
      };
      created = newMission;
      return [...current, newMission];
    });

    if (!created) return;

    try {
      await persistAuthenticated(async (userId) => {
        await missionsService.create(supabaseRef.current!, userId, created!);
      });
    } catch (error) {
      console.error("[TrueNorth] Persistence failed:", error);
      throw error;
    }
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

  // Ensure weekly bearings exist (rule-based seed when missing or week rolled).
  const weeklyBearingsWeekStart = weeklyBearings?.weekStart ?? null;
  useEffect(() => {
    const evidenceEntries = buildEvidenceEntriesFromDebriefs(
      dailyDebriefHistory,
      missionIntentHistory,
      currentMission?.name
    );
    const ensured = ensureWeeklyBearings(weeklyBearings, {
      alignment: null,
      established: dailyDebriefHistory.length >= 3,
      dailyDebriefHistory,
      evidenceEntries,
      currentMission,
      previousWeeklyBearingIds: weeklyBearings?.bearingIds,
    });

    if (
      weeklyBearingsWeekStart !== ensured.weekStart
    ) {
      setWeeklyBearingsState(ensured);
      persistLocalSession({
        todaysMissionIntent,
        dailyDebriefHistory,
        missionIntentHistory,
        weeklyBearings: ensured,
      });
      persistIfAuthenticated((userId) =>
        persistWeeklyBearings(supabaseRef.current!, userId, ensured).catch(
          (error) => {
            console.error("[TrueNorth] Weekly bearings persist failed:", error);
          }
        )
      );
    }
    // Seed only when the calendar week changes or bearings are missing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyBearingsWeekStart, dailyDebriefHistory.length, currentMission?.id]);

  const value: TrueNorthContextValue = {
    myStandard,
    todaysMissionIntent,
    todaysOnePercent,
    weeklyBearings,
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
    hasCompletedOnboarding: onboardingComplete,
    setMyStandard,
    markWelcomeComplete,
    markStandardsComplete,
    markMissionStageComplete,
    markOnboardingComplete,
    setTodaysMissionIntent,
    setTodaysOnePercent,
    setWeeklyBearings,
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
