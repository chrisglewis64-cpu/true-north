export { missionsService } from "@/lib/database/services/missions.service";
export type { MissionsStartupResult } from "@/lib/database/services/missions.service";

export type {
  Database,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/lib/database/database.types";

export {
  mapAuthUserToSession,
  mapDailyDebriefRow,
  mapDailyDebriefToInsert,
  mapDailyOnePercentRow,
  mapDailyOnePercentToInsert,
  mapMissionIntentRow,
  mapMissionIntentToInsert,
  mapMissionInputToUpdate,
  mapMissionRow,
  mapMissionToInsert,
  mapStandardRow,
} from "@/lib/database/mappers";

export { loadTrueNorthState } from "@/lib/database/load-true-north-state";

export {
  persistCompleteMission,
  persistCreateMission,
  persistDailyDebrief,
  persistDailyOnePercent,
  persistMissionIntent,
  persistUpdateMission,
  persistWeeklyBearings,
} from "@/lib/database/persist-true-north-state";

export {
  resolveUserSession,
  upsertProfile,
  fetchProfile,
  fetchNotificationPreferences,
  saveNotificationPreferences,
  markWelcomeComplete,
  markStandardsComplete,
  markMissionStageComplete,
  markOnboardingComplete,
  isOnboardingComplete,
} from "@/lib/database/profiles.repository";
export { upsertPushSubscription } from "@/lib/database/push-subscriptions.repository";
export {
  fetchStandards,
  replaceStandards,
} from "@/lib/database/standards.repository";
export { fetchMissions, insertMission, updateMissionById, completeMissionById } from "@/lib/database/missions.repository";
export { fetchMissionIntentForDate, upsertMissionIntent } from "@/lib/database/mission-intents.repository";
export { fetchDailyDebriefForDate, upsertDailyDebrief } from "@/lib/database/daily-debriefs.repository";
export { fetchDailyOnePercentForDate, upsertDailyOnePercent } from "@/lib/database/daily-one-percent.repository";
export {
  fetchRecentEvidence,
  syncEvidenceForDebrief,
} from "@/lib/database/evidence.repository";
export {
  fetchWeeklyBearings,
  upsertWeeklyBearings,
} from "@/lib/database/weekly-bearings.repository";

export { createMissionUuid, getLocalDateString } from "@/lib/database/utils";
