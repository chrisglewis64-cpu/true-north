import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import type { WeeklyBearings } from "@/types/bearing";

type Client = SupabaseClient<Database>;

function mapWeeklyBearingsRow(
  row: Database["public"]["Tables"]["weekly_bearings"]["Row"]
): WeeklyBearings {
  const ids = row.bearing_ids;
  return {
    weekStart: row.week_start,
    bearingIds: [ids[0] ?? "", ids[1] ?? "", ids[2] ?? ""] as [
      string,
      string,
      string,
    ],
    selectedAt: row.selected_at,
    source: row.source,
  };
}

export async function fetchWeeklyBearings(
  client: Client,
  userId: string,
  weekStart: string
): Promise<WeeklyBearings | null> {
  const { data, error } = await client
    .from("weekly_bearings")
    .select("*")
    .eq("user_id", userId)
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapWeeklyBearingsRow(data) : null;
}

export async function upsertWeeklyBearings(
  client: Client,
  userId: string,
  weekly: WeeklyBearings
): Promise<void> {
  const { error } = await client.from("weekly_bearings").upsert(
    {
      user_id: userId,
      week_start: weekly.weekStart,
      bearing_ids: [...weekly.bearingIds],
      source: weekly.source,
      selected_at: weekly.selectedAt,
    },
    { onConflict: "user_id,week_start" }
  );

  if (error) {
    throw error;
  }
}
