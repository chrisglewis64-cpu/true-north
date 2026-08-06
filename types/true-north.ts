import type { DailyDebrief, DailyDebriefDraft, DailyDebriefState } from "@/types/daily-debrief";
import type { DailyOnePercent } from "@/types/one-percent";
import type { Mission, MissionInput, MissionStatus } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { WeeklyReview } from "@/types/review";
import type { Standard } from "@/types/standard";
import type { UserSession } from "@/types/session";
import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";

/**
 * The complete in-memory application state for a single running session.
 */
export interface TrueNorthState {
  myStandard: Standard[];
  todaysMissionIntent: MissionIntent | null;
  todaysOnePercent: DailyOnePercent;
  dailyDebrief: DailyDebriefState;
  dailyDebriefHistory: DatedDailyDebrief[];
  missionIntentHistory: DatedMissionIntent[];
  weeklyReviews: WeeklyReview[];
  session: UserSession;
  missions: Mission[];
}

/**
 * Context API surface — state, derived values, and mutation actions.
 */
export interface TrueNorthContextValue extends TrueNorthState {
  currentMission: Mission | null;
  currentMissionStatus: MissionStatus | null;
  hasCompletedMorningCommit: boolean;
  hasCompletedOnboarding: boolean;
  setMyStandard: (standards: Standard[]) => Promise<void>;
  markOnboardingComplete: () => Promise<void>;
  setTodaysMissionIntent: (intent: MissionIntent) => Promise<void>;
  setTodaysOnePercent: (value: DailyOnePercent) => void;
  setDailyDebriefSubmission: (value: DailyDebrief | null) => void;
  setDailyDebriefDraft: (value: DailyDebriefDraft | null) => void;
  updateDailyDebriefDraft: (partial: Partial<DailyDebriefDraft>) => void;
  createMission: (input: MissionInput) => Promise<void>;
  updateMission: (id: string, input: MissionInput) => void;
  completeMission: (id: string, lessonsLearned: string) => void;
  getMissionById: (id: string) => Mission | undefined;
}
