import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { mapStandardRow } from "@/lib/database/mappers";
import { createStandardsFromStatements } from "@/lib/true-north-defaults";
import { theCode } from "@/lib/placeholder-data";
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

export async function seedStandardsIfEmpty(
  client: Client,
  userId: string
): Promise<Standard[]> {
  const existing = await fetchStandards(client, userId);
  if (existing.length > 0) return existing;

  const principles = createStandardsFromStatements(theCode);
  const rows = principles.map((standard) => ({
    user_id: userId,
    sort_order: standard.order,
    statement: standard.statement,
  }));

  const { data, error } = await client.from("standards").insert(rows).select("*");

  if (error) throw error;
  return (data ?? []).map(mapStandardRow);
}
