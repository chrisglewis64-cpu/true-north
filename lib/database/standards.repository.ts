import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { mapStandardRow } from "@/lib/database/mappers";
import type { Standard } from "@/types/standard";

type Client = SupabaseClient<Database>;

export async function fetchStandards(
  client: Client,
  userId: string
): Promise<Standard[]> {
  const { data, error } = await client
    .from("standards")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapStandardRow);
}

/**
 * Replaces all standards for a user with the provided ordered list.
 * Used by first-time onboarding.
 */
export async function replaceStandards(
  client: Client,
  userId: string,
  standards: Standard[]
): Promise<Standard[]> {
  const { error: deleteError } = await client
    .from("standards")
    .delete()
    .eq("user_id", userId);

  if (deleteError) throw deleteError;

  if (standards.length === 0) {
    return [];
  }

  const rows = standards.map((standard, index) => ({
    user_id: userId,
    sort_order: index + 1,
    statement: standard.statement.trim(),
  }));

  const { data, error } = await client.from("standards").insert(rows).select("*");

  if (error) throw error;
  return (data ?? [])
    .map(mapStandardRow)
    .sort((a, b) => a.order - b.order);
}
