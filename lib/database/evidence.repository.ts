import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import type { EvidenceEntry } from "@/types/evidence";

type Client = SupabaseClient<Database>;

export function mapEvidenceRow(
  row: Database["public"]["Tables"]["evidence"]["Row"]
): EvidenceEntry {
  return {
    id: row.id,
    evidenceDate: row.evidence_date,
    standardStatement: row.standard_statement,
    evidenceText: row.evidence_text,
    missionReference: row.mission_reference,
    debriefDate: row.debrief_date,
    recordedAt: row.recorded_at,
  };
}

/**
 * Replace evidence for a debrief date (same-day re-sync), then insert proof rows.
 * Users never edit or delete from the UI — Evidence is history.
 */
export async function syncEvidenceForDebrief(
  client: Client,
  userId: string,
  debriefDate: string,
  entries: Omit<EvidenceEntry, "id">[]
): Promise<void> {
  const { error: deleteError } = await client
    .from("evidence")
    .delete()
    .eq("user_id", userId)
    .eq("debrief_date", debriefDate);

  if (deleteError) {
    throw deleteError;
  }

  if (entries.length === 0) {
    return;
  }

  const { error: insertError } = await client.from("evidence").insert(
    entries.map((entry) => ({
      user_id: userId,
      evidence_date: entry.evidenceDate,
      debrief_date: entry.debriefDate,
      standard_statement: entry.standardStatement,
      evidence_text: entry.evidenceText,
      mission_reference: entry.missionReference,
      recorded_at: entry.recordedAt,
    }))
  );

  if (insertError) {
    throw insertError;
  }
}

export async function fetchRecentEvidence(
  client: Client,
  userId: string,
  limit = 100
): Promise<EvidenceEntry[]> {
  const { data, error } = await client
    .from("evidence")
    .select("*")
    .eq("user_id", userId)
    .order("evidence_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapEvidenceRow);
}
