import type { DebriefSubmission } from "@/lib/debrief-form";
import type { Mission, MissionDraft } from "@/types/mission";
import type { DebriefRecord } from "@/lib/storage/local-session";

export type AppState = {
  isReady: boolean;
  morningCommitCompleted: boolean;
  todaysCommitment: string;
  todaysOnePercent: string;
  todaysDebrief: DebriefSubmission | null;
  debriefHistory: DebriefRecord[];
  missions: Mission[];
};

export type AppContextValue = AppState & {
  setTodaysCommitment: (value: string) => void;
  setTodaysOnePercent: (value: string) => void;
  setTodaysDebrief: (value: DebriefSubmission | null) => void;
  completeDebrief: (debrief: DebriefSubmission) => Promise<void>;
  completeMorningCommit: (commitment: string) => Promise<void>;
  createMission: (draft: MissionDraft) => Promise<void>;
  createActiveMission: (draft: MissionDraft) => Promise<void>;
  updateMission: (id: string, draft: MissionDraft) => Promise<void>;
  deleteMission: (id: string) => Promise<void>;
  reorderUpcomingMission: (id: string, direction: "up" | "down") => Promise<void>;
  startMission: (id: string) => Promise<void>;
  completeMission: (id: string, missionReview: string) => Promise<void>;
  getMissionById: (id: string) => Mission | undefined;
};
