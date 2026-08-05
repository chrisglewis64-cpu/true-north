import type { DebriefSubmission } from "@/lib/debrief-form";
import type { Mission, MissionDraft } from "@/types/mission";
import type { DebriefRecord } from "@/lib/storage/local-session";

export type AppState = {
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
  completeDebrief: (debrief: DebriefSubmission) => void;
  completeMorningCommit: (commitment: string) => void;
  createMission: (draft: MissionDraft) => void;
  updateMission: (id: string, draft: MissionDraft) => void;
  deleteMission: (id: string) => void;
  reorderUpcomingMission: (id: string, direction: "up" | "down") => void;
  startMission: (id: string) => void;
  completeMission: (id: string, missionReview: string) => void;
  getMissionById: (id: string) => Mission | undefined;
};
