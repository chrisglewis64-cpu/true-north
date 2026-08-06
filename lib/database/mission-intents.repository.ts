import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import {
  mapMissionIntentRow,
  mapMissionIntentToInsert,
} from "@/lib/database/mappers";
import type { MissionIntent } from "@/types/mission-intent";

type Client = SupabaseClient<Database>;

export async function fetchRecentMissionIntents(
  client: Client,
  userId: string,
  limit = 1000
): Promise<Array<{ intentDate: string; intent: MissionIntent }>> {
  const { data, error } = await client
    .from("mission_intents")
    .select("*")
    .eq("user_id", userId)
    .order("intent_date", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    intentDate: row.intent_date,
    intent: mapMissionIntentRow(row),
  }));
}

export async function fetchMissionIntentForDate(
  client: Client,
  userId: string,
  intentDate: string
): Promise<MissionIntent | null> {
  const { data, error } = await client
    .from("mission_intents")
    .select("*")
    .eq("user_id", userId)
    .eq("intent_date", intentDate)
    .maybeSingle();

  if (error) throw error;
  return data ? mapMissionIntentRow(data) : null;
}

export async function upsertMissionIntent(
  client: Client,
  userId: string,
  intentDate: string,
  intent: MissionIntent
): Promise<void> {
  const { error } = await client.from("mission_intents").upsert(
    mapMissionIntentToInsert(userId, intentDate, intent),
    { onConflict: "user_id,intent_date" }
  );

  if (error) throw error;
}
