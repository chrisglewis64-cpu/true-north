import type { SupabaseClient } from "@supabase/supabase-js";
import { mapStandardRow } from "@/lib/data/mappers";
import type { Standard, StandardRow } from "@/types/standard";

export async function fetchStandards(
  supabase: SupabaseClient,
  userId: string,
): Promise<Standard[]> {
  const { data, error } = await supabase
    .from("standards")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as StandardRow[]).map(mapStandardRow);
}

export async function replaceStandards(
  supabase: SupabaseClient,
  userId: string,
  statements: string[],
): Promise<Standard[]> {
  await supabase.from("standards").delete().eq("user_id", userId);

  if (statements.length === 0) {
    return [];
  }

  const rows = statements.map((statement, index) => ({
    user_id: userId,
    statement,
    sort_order: index,
  }));

  const { data, error } = await supabase
    .from("standards")
    .insert(rows)
    .select("*");

  if (error || !data) {
    return [];
  }

  return (data as StandardRow[]).map(mapStandardRow);
}
