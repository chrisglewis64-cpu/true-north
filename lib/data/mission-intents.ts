import type { SupabaseClient } from "@supabase/supabase-js";
import { getCalendarDateKey } from "@/lib/storage/local-session";

export async function fetchTodaysIntent(
  supabase: SupabaseClient,
  userId: string,
  date = getCalendarDateKey(),
): Promise<string | null> {
  const { data, error } = await supabase
    .from("mission_intents")
    .select("commitment")
    .eq("user_id", userId)
    .eq("intent_date", date)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.commitment;
}

export async function upsertMissionIntent(
  supabase: SupabaseClient,
  userId: string,
  commitment: string,
  date = getCalendarDateKey(),
): Promise<void> {
  const { error } = await supabase.from("mission_intents").upsert(
    {
      user_id: userId,
      intent_date: date,
      commitment,
    },
    { onConflict: "user_id,intent_date" },
  );

  if (error) {
    throw error;
  }
}

export async function hasMissionIntentToday(
  supabase: SupabaseClient,
  userId: string,
  date = getCalendarDateKey(),
): Promise<boolean> {
  const intent = await fetchTodaysIntent(supabase, userId, date);
  return Boolean(intent?.trim());
}
