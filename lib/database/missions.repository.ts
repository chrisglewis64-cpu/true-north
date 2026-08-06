import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import {
  mapMissionInputToUpdate,
  mapMissionRow,
  mapMissionToInsert,
} from "@/lib/database/mappers";
import type { Mission, MissionInput } from "@/types/mission";

type Client = SupabaseClient<Database>;

export async function fetchMissions(
  client: Client,
  userId: string
): Promise<Mission[]> {
  const { data, error } = await client
    .from("missions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapMissionRow);
}

export async function insertMission(
  client: Client,
  userId: string,
  mission: Mission
): Promise<Mission> {
  const { data, error } = await client
    .from("missions")
    .insert(mapMissionToInsert(userId, mission))
    .select("*")
    .single();

  if (error) throw error;
  return mapMissionRow(data);
}

export async function updateMissionById(
  client: Client,
  userId: string,
  missionId: string,
  input: MissionInput
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await client
    .from("missions")
    .update(mapMissionInputToUpdate(input, now))
    .eq("id", missionId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function completeMissionById(
  client: Client,
  userId: string,
  missionId: string,
  lessonsLearned: string
): Promise<void> {
  const now = new Date().toISOString();
  const { error } = await client
    .from("missions")
    .update({
      lifecycle: "completed",
      mission_status: "complete",
      status_source: "manual",
      status_updated_at: now,
      lessons_learned: lessonsLearned,
      completed_at: now,
    })
    .eq("id", missionId)
    .eq("user_id", userId);

  if (error) throw error;
}
