import type { DebriefSubmission } from "@/lib/debrief-form";

export type CurrentMission = {
  title: string;
  purpose: string;
  progress: string;
  nextAction: string;
  statement: string;
  roles: readonly string[];
};

export type AppState = {
  todaysCommitment: string;
  todaysOnePercent: string;
  todaysDebrief: DebriefSubmission | null;
  currentMission: CurrentMission;
};

export type AppContextValue = AppState & {
  setTodaysCommitment: (value: string) => void;
  setTodaysOnePercent: (value: string) => void;
  setTodaysDebrief: (value: DebriefSubmission | null) => void;
  setCurrentMission: (value: CurrentMission) => void;
};
