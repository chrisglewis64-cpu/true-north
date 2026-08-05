export type MissionLifecycleStatus = "active" | "upcoming" | "completed";

export type Mission = {
  id: string;
  name: string;
  purpose: string;
  successCriteria: string;
  missionStatus: string;
  nextMilestone: string;
  lifecycleStatus: MissionLifecycleStatus;
  sortOrder: number;
  missionReview?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type MissionDraft = {
  name: string;
  purpose: string;
  successCriteria: string;
  missionStatus: string;
  nextMilestone: string;
};

export type MissionBuilderStep = 1 | 2 | 3 | 4;
