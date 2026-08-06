import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import {
  mapDailyOnePercentRow,
  mapDailyOnePercentToInsert,
} from "@/lib/database/mappers";
import type { DailyOnePercent } from "@/types/one-percent";

type Client = SupabaseClient<Database>;

export async function fetchDailyOnePercentForDate(
  client: Client,
  userId: string,
  effectiveDate: string
): Promise<DailyOnePercent | null> {
  const { data, error } = await client
    .from("daily_one_percent")
    .select("*")
    .eq("user_id", userId)
    .eq("effective_date", effectiveDate)
    .maybeSingle();

  if (error) throw error;
  return data ? mapDailyOnePercentRow(data) : null;
}

export async function upsertDailyOnePercent(
  client: Client,
  userId: string,
  effectiveDate: string,
  onePercent: DailyOnePercent
): Promise<void> {
  const { error } = await client.from("daily_one_percent").upsert(
    mapDailyOnePercentToInsert(userId, effectiveDate, onePercent),
    { onConflict: "user_id,effective_date" }
  );

  if (error) throw error;
}
