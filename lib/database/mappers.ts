import type { Tables, TablesInsert, TablesUpdate } from "@/lib/database/database.types";
import type { OnboardingProgress } from "@/lib/onboarding/stages";
import type { DailyDebrief, DailyDebriefStandardEntry } from "@/types/daily-debrief";
import type { DailyOnePercent } from "@/types/one-percent";
import type { Mission, MissionInput } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { Standard } from "@/types/standard";
import type { UserSession } from "@/types/session";

export function mapStandardRow(row: Tables<"standards">): Standard {
  return {
    id: row.id,
    order: row.sort_order,
    statement: row.statement,
  };
}

export function mapMissionRow(row: Tables<"missions">): Mission {
  return {
    id: row.id,
    name: row.name,
    purpose: row.purpose,
    category: row.category ?? "",
    whyThisMatters: row.why_this_matters,
    successCriteria: row.success_criteria,
    currentProgress: row.current_progress,
    nextMilestone: row.next_milestone,
    status: row.lifecycle,
    missionStatus: row.mission_status,
    statusSource: row.status_source,
    statusUpdatedAt: row.status_updated_at,
    lessonsLearned: row.lessons_learned,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export function mapMissionToInsert(
  userId: string,
  mission: Mission
): TablesInsert<"missions"> {
  return {
    id: mission.id,
    user_id: userId,
    name: mission.name,
    purpose: mission.purpose,
    category: mission.category || "",
    why_this_matters: mission.whyThisMatters,
    success_criteria: mission.successCriteria,
    current_progress: mission.currentProgress,
    next_milestone: mission.nextMilestone,
    lifecycle: mission.status,
    mission_status: mission.missionStatus,
    status_source: mission.statusSource,
    status_updated_at: mission.statusUpdatedAt,
    lessons_learned: mission.lessonsLearned,
    created_at: mission.createdAt,
    completed_at: mission.completedAt,
  };
}

export function mapMissionInputToInsert(
  userId: string,
  mission: Mission
): TablesInsert<"missions"> {
  return mapMissionToInsert(userId, mission);
}

export function mapMissionInputToUpdate(
  input: MissionInput,
  statusUpdatedAt: string
): TablesUpdate<"missions"> {
  return {
    name: input.name,
    purpose: input.purpose,
    category: input.category || "",
    why_this_matters: input.whyThisMatters,
    success_criteria: input.successCriteria,
    current_progress: input.currentProgress,
    next_milestone: input.nextMilestone,
    mission_status: input.missionStatus,
    status_source: "manual",
    status_updated_at: statusUpdatedAt,
  };
}

export function mapMissionIntentRow(
  row: Tables<"mission_intents">
): MissionIntent {
  return {
    commitment: row.commitment,
    source: row.source,
    createdAt: row.created_at,
  };
}

export function mapMissionIntentToInsert(
  userId: string,
  intentDate: string,
  intent: MissionIntent
): TablesInsert<"mission_intents"> {
  return {
    user_id: userId,
    intent_date: intentDate,
    commitment: intent.commitment,
    source: intent.source,
    created_at: intent.createdAt,
  };
}

export function mapDailyDebriefRow(row: Tables<"daily_debriefs">): DailyDebrief {
  return {
    standards: row.standards as unknown as DailyDebriefStandardEntry[],
    biggestWin: row.biggest_win,
    biggestLesson: row.biggest_lesson,
    tomorrowOnePercent: row.tomorrow_one_percent,
    tomorrowPriority: row.tomorrow_priority,
    courseCorrection: row.course_correction,
    completedAt: row.completed_at,
  };
}

export function mapDailyDebriefToInsert(
  userId: string,
  debriefDate: string,
  debrief: DailyDebrief
): TablesInsert<"daily_debriefs"> {
  return {
    user_id: userId,
    debrief_date: debriefDate,
    standards: debrief.standards as unknown as TablesInsert<"daily_debriefs">["standards"],
    biggest_win: debrief.biggestWin,
    biggest_lesson: debrief.biggestLesson,
    tomorrow_one_percent: debrief.tomorrowOnePercent,
    tomorrow_priority: debrief.tomorrowPriority,
    course_correction: debrief.courseCorrection,
    completed_at: debrief.completedAt,
  };
}

export function mapDailyOnePercentRow(
  row: Tables<"daily_one_percent">
): DailyOnePercent {
  return {
    improvement: row.improvement,
    setAt: row.set_at,
    source: row.source,
  };
}

export function mapDailyOnePercentToInsert(
  userId: string,
  effectiveDate: string,
  onePercent: DailyOnePercent
): TablesInsert<"daily_one_percent"> {
  return {
    user_id: userId,
    effective_date: effectiveDate,
    improvement: onePercent.improvement,
    source: onePercent.source,
    set_at: onePercent.setAt,
  };
}

export function mapOnboardingProgress(row: {
  welcome_completed_at?: string | null;
  standards_completed_at?: string | null;
  mission_completed_at?: string | null;
  onboarding_completed_at?: string | null;
}): OnboardingProgress {
  return {
    welcomeCompletedAt: row.welcome_completed_at ?? null,
    standardsCompletedAt: row.standards_completed_at ?? null,
    missionCompletedAt: row.mission_completed_at ?? null,
    onboardingCompletedAt: row.onboarding_completed_at ?? null,
  };
}

export function mapAuthUserToSession(
  userId: string,
  displayName: string,
  startedAt: string,
  onboarding: OnboardingProgress,
  email: string | null = null
): UserSession {
  return {
    id: userId,
    displayName,
    email,
    startedAt,
    onboardingCompletedAt: onboarding.onboardingCompletedAt,
    onboarding,
  };
}
