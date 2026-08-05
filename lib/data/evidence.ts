import type { SupabaseClient } from "@supabase/supabase-js";
import type { EvidenceRow } from "@/lib/data/mappers";
import type { EvidenceEntry } from "@/lib/evidence/build-evidence-entries";

export async function fetchEvidenceEntries(
  supabase: SupabaseClient,
  userId: string,
): Promise<EvidenceEntry[]> {
  const { data, error } = await supabase
    .from("evidence")
    .select("*")
    .eq("user_id", userId)
    .order("evidence_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as EvidenceRow[]).map((row) => ({
    id: row.id,
    label: row.content,
    date: row.evidence_date,
  }));
}
