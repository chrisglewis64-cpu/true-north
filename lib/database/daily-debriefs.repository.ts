import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import {
  mapDailyDebriefRow,
  mapDailyDebriefToInsert,
} from "@/lib/database/mappers";
import type { DailyDebrief } from "@/types/daily-debrief";

type Client = SupabaseClient<Database>;

export async function fetchRecentDailyDebriefs(
  client: Client,
  userId: string,
  limit = 14
): Promise<Array<{ debriefDate: string; debrief: DailyDebrief }>> {
  const { data, error } = await client
    .from("daily_debriefs")
    .select("*")
    .eq("user_id", userId)
    .order("debrief_date", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((row) => ({
    debriefDate: row.debrief_date,
    debrief: mapDailyDebriefRow(row),
  }));
}

export async function fetchDailyDebriefForDate(
  client: Client,
  userId: string,
  debriefDate: string
): Promise<DailyDebrief | null> {
  const { data, error } = await client
    .from("daily_debriefs")
    .select("*")
    .eq("user_id", userId)
    .eq("debrief_date", debriefDate)
    .maybeSingle();

  if (error) throw error;
  return data ? mapDailyDebriefRow(data) : null;
}

export async function upsertDailyDebrief(
  client: Client,
  userId: string,
  debriefDate: string,
  debrief: DailyDebrief
): Promise<void> {
  const { error } = await client.from("daily_debriefs").upsert(
    mapDailyDebriefToInsert(userId, debriefDate, debrief),
    { onConflict: "user_id,debrief_date" }
  );

  if (error) throw error;
}
