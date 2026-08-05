/**
 * Which queue a mission belongs to: current, upcoming, or archived.
 */
export type MissionLifecycle = "active" | "upcoming" | "completed";

/**
 * Predefined health status for a mission (MISSION_SYSTEM.md).
 * User-selected now; calculated automatically in a future version.
 */
export type MissionStatus = "on_track" | "at_risk" | "off_course" | "complete";

/**
 * Whether mission status was set by the user or derived by the system.
 */
export type MissionStatusSource = "manual" | "calculated";

/**
 * A period of focused effort toward becoming the person you have chosen to be.
 * Not a goal — a season of disciplined action tied to identity.
 */
export interface Mission {
  id: string;
  name: string;
  purpose: string;
  whyThisMatters: string;
  successCriteria: string;
  currentProgress: string;
  nextMilestone: string;
  /** Lifecycle queue: current, upcoming, or completed */
  status: MissionLifecycle;
  /** Health status: on track, at risk, off course, or complete */
  missionStatus: MissionStatus;
  statusSource: MissionStatusSource;
  statusUpdatedAt: string | null;
  lessonsLearned: string;
  createdAt: string;
  completedAt: string | null;
}

/**
 * Fields collected when creating or editing a mission.
 */
export interface MissionInput {
  name: string;
  purpose: string;
  whyThisMatters: string;
  successCriteria: string;
  currentProgress: string;
  nextMilestone: string;
  missionStatus: MissionStatus;
}

/**
 * Required input when completing a mission — becomes permanent proof.
 */
export interface MissionCompleteInput {
  lessonsLearned: string;
}
