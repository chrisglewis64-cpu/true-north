import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { upsertDailyDebrief } from "@/lib/database/daily-debriefs.repository";
import { upsertDailyOnePercent } from "@/lib/database/daily-one-percent.repository";
import { syncEvidenceForDebrief } from "@/lib/database/evidence.repository";
import { upsertMissionIntent } from "@/lib/database/mission-intents.repository";
import {
  completeMissionById,
  insertMission,
  updateMissionById,
} from "@/lib/database/missions.repository";
import { upsertWeeklyBearings } from "@/lib/database/weekly-bearings.repository";
import { getLocalDateString } from "@/lib/database/utils";
import type { WeeklyBearings } from "@/types/bearing";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { EvidenceEntry } from "@/types/evidence";
import type { DailyOnePercent } from "@/types/one-percent";
import type { Mission, MissionInput } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";

type Client = SupabaseClient<Database>;

export async function persistMissionIntent(
  client: Client,
  userId: string,
  intent: MissionIntent
): Promise<void> {
  await upsertMissionIntent(client, userId, getLocalDateString(), intent);
}

export async function persistDailyOnePercent(
  client: Client,
  userId: string,
  onePercent: DailyOnePercent
): Promise<void> {
  await upsertDailyOnePercent(client, userId, getLocalDateString(), onePercent);
}

export async function persistWeeklyBearings(
  client: Client,
  userId: string,
  weekly: WeeklyBearings
): Promise<void> {
  await upsertWeeklyBearings(client, userId, weekly);
}

export async function persistDailyDebrief(
  client: Client,
  userId: string,
  debrief: DailyDebrief,
  evidenceEntries: Omit<EvidenceEntry, "id">[] = []
): Promise<void> {
  const debriefDate = getLocalDateString();
  await upsertDailyDebrief(client, userId, debriefDate, debrief);

  try {
    await syncEvidenceForDebrief(client, userId, debriefDate, evidenceEntries);
  } catch (error) {
    // Evidence table may not be migrated yet — debrief still persists.
    console.error("[TrueNorth] Evidence sync failed:", error);
  }
}

export async function persistCreateMission(
  client: Client,
  userId: string,
  mission: Mission
): Promise<void> {
  await insertMission(client, userId, mission);
}

export async function persistUpdateMission(
  client: Client,
  missionId: string,
  input: MissionInput
): Promise<void> {
  await updateMissionById(client, missionId, input);
}

export async function persistCompleteMission(
  client: Client,
  missionId: string,
  lessonsLearned: string
): Promise<void> {
  await completeMissionById(client, missionId, lessonsLearned);
}
