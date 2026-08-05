import type { DebriefSubmission } from "@/lib/debrief-form";
import type { Mission } from "@/types/mission";
import type { Profile, ProfileRow } from "@/types/profile";
import type { Standard, StandardRow } from "@/types/standard";

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    timezone: row.timezone,
    onboardingComplete: row.onboarding_complete,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapStandardRow(row: StandardRow): Standard {
  return {
    id: row.id,
    statement: row.statement,
    sortOrder: row.sort_order,
  };
}

export type MissionRow = {
  id: string;
  user_id: string;
  name: string;
  purpose: string;
  success_criteria: string;
  mission_status: string;
  next_milestone: string;
  lifecycle_status: Mission["lifecycleStatus"];
  sort_order: number;
  mission_review: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export function mapMissionRow(row: MissionRow): Mission {
  return {
    id: row.id,
    name: row.name,
    purpose: row.purpose,
    successCriteria: row.success_criteria,
    missionStatus: row.mission_status,
    nextMilestone: row.next_milestone,
    lifecycleStatus: row.lifecycle_status,
    sortOrder: row.sort_order,
    missionReview: row.mission_review ?? undefined,
    completedAt: row.completed_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function missionToRow(
  mission: Mission,
  userId: string,
): Omit<MissionRow, "created_at" | "updated_at"> {
  return {
    id: mission.id,
    user_id: userId,
    name: mission.name,
    purpose: mission.purpose,
    success_criteria: mission.successCriteria,
    mission_status: mission.missionStatus,
    next_milestone: mission.nextMilestone,
    lifecycle_status: mission.lifecycleStatus,
    sort_order: mission.sortOrder,
    mission_review: mission.missionReview ?? null,
    completed_at: mission.completedAt ?? null,
  };
}

export type DebriefRow = {
  id: string;
  user_id: string;
  debrief_date: string;
  submission: DebriefSubmission;
  completed_at: string;
  created_at: string;
  updated_at: string;
};

export type EvidenceRow = {
  id: string;
  user_id: string;
  debrief_id: string | null;
  evidence_date: string;
  kind: "standard_proof" | "win";
  content: string;
  created_at: string;
};

export type ReviewRow = {
  id: string;
  user_id: string;
  review_type: "daily" | "weekly" | "monthly" | "annual";
  period_key: string;
  completed_at: string;
  data: Record<string, unknown> | null;
};
