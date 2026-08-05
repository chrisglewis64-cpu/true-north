import type { SupabaseClient } from "@supabase/supabase-js";
import {
  mapMissionRow,
  missionToRow,
  type MissionRow,
} from "@/lib/data/mappers";
import type { Mission, MissionDraft } from "@/types/mission";
import {
  completeMissionRecord,
  createUpcomingMission,
  deleteMissionRecord,
  moveUpcomingMission,
  startMissionRecord,
  updateMissionRecord,
} from "@/lib/missions/mission-actions";
import { createMissionFromDraft } from "@/lib/missions/default-missions";

export async function fetchMissions(
  supabase: SupabaseClient,
  userId: string,
): Promise<Mission[]> {
  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as MissionRow[]).map(mapMissionRow);
}

async function persistMissions(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
): Promise<void> {
  const rows = missions.map((mission) => missionToRow(mission, userId));

  const { error: deleteError } = await supabase
    .from("missions")
    .delete()
    .eq("user_id", userId);

  if (deleteError) {
    throw deleteError;
  }

  if (rows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("missions").insert(rows);
  if (insertError) {
    throw insertError;
  }
}

export async function createMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  draft: MissionDraft,
): Promise<Mission[]> {
  const next = createUpcomingMission(missions, draft);
  await persistMissions(supabase, userId, next);
  return next;
}

export async function createActiveMission(
  supabase: SupabaseClient,
  userId: string,
  draft: MissionDraft,
): Promise<Mission[]> {
  const mission = createMissionFromDraft(draft, "active", 0);
  await persistMissions(supabase, userId, [mission]);
  return [mission];
}

export async function updateMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  id: string,
  draft: MissionDraft,
): Promise<Mission[]> {
  const next = updateMissionRecord(missions, id, draft);
  await persistMissions(supabase, userId, next);
  return next;
}

export async function deleteMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  id: string,
): Promise<Mission[]> {
  const next = deleteMissionRecord(missions, id);
  await persistMissions(supabase, userId, next);
  return next;
}

export async function reorderMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  id: string,
  direction: "up" | "down",
): Promise<Mission[]> {
  const next = moveUpcomingMission(missions, id, direction);
  await persistMissions(supabase, userId, next);
  return next;
}

export async function startMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  id: string,
): Promise<Mission[]> {
  const next = startMissionRecord(missions, id);
  await persistMissions(supabase, userId, next);
  return next;
}

export async function completeMission(
  supabase: SupabaseClient,
  userId: string,
  missions: Mission[],
  id: string,
  missionReview: string,
): Promise<Mission[]> {
  const next = completeMissionRecord(missions, id, missionReview);
  await persistMissions(supabase, userId, next);
  return next;
}
