import type { SupabaseClient } from "@supabase/supabase-js";
import { getCalendarDateKey } from "@/lib/storage/local-session";

function getWeekKey(date = new Date()): string {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return getCalendarDateKey(start);
}

export async function hasCompletedWeeklyReviewThisWeek(
  supabase: SupabaseClient,
  userId: string,
  date = new Date(),
): Promise<boolean> {
  const periodKey = getWeekKey(date);

  const { data, error } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", userId)
    .eq("review_type", "weekly")
    .eq("period_key", periodKey)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function markWeeklyReviewComplete(
  supabase: SupabaseClient,
  userId: string,
  date = new Date(),
): Promise<void> {
  const periodKey = getWeekKey(date);

  await supabase.from("reviews").upsert(
    {
      user_id: userId,
      review_type: "weekly",
      period_key: periodKey,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,review_type,period_key" },
  );
}
