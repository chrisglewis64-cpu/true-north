import type { SupabaseClient } from "@supabase/supabase-js";
import type { DebriefSubmission } from "@/lib/debrief-form";
import {
  type DebriefRow,
  type EvidenceRow,
} from "@/lib/data/mappers";
import type { DebriefRecord } from "@/lib/storage/local-session";
import { getCalendarDateKey } from "@/lib/storage/local-session";

function mapDebriefRow(row: DebriefRow): DebriefRecord {
  return {
    ...row.submission,
    date: row.debrief_date,
    completedAt: row.completed_at,
  };
}

export async function fetchDebriefHistory(
  supabase: SupabaseClient,
  userId: string,
): Promise<DebriefRecord[]> {
  const { data, error } = await supabase
    .from("daily_debriefs")
    .select("*")
    .eq("user_id", userId)
    .order("debrief_date", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as DebriefRow[]).map(mapDebriefRow);
}

export async function fetchTodaysDebrief(
  supabase: SupabaseClient,
  userId: string,
  date = getCalendarDateKey(),
): Promise<DebriefSubmission | null> {
  const { data, error } = await supabase
    .from("daily_debriefs")
    .select("submission")
    .eq("user_id", userId)
    .eq("debrief_date", date)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data.submission as DebriefSubmission;
}

async function syncEvidenceForDebrief(
  supabase: SupabaseClient,
  userId: string,
  debriefId: string,
  record: DebriefRecord,
): Promise<void> {
  await supabase.from("evidence").delete().eq("debrief_id", debriefId);

  const rows: Omit<EvidenceRow, "id" | "created_at">[] = [];

  record.standards.forEach((standard) => {
    const content = standard.evidence.trim();
    if (!content) {
      return;
    }

    rows.push({
      user_id: userId,
      debrief_id: debriefId,
      evidence_date: record.date,
      kind: "standard_proof",
      content,
    });
  });

  const win = record.biggestWin.trim();
  if (win) {
    rows.push({
      user_id: userId,
      debrief_id: debriefId,
      evidence_date: record.date,
      kind: "win",
      content: win,
    });
  }

  if (rows.length > 0) {
    await supabase.from("evidence").insert(rows);
  }
}

export async function upsertDebrief(
  supabase: SupabaseClient,
  userId: string,
  debrief: DebriefSubmission,
  date = getCalendarDateKey(),
): Promise<DebriefRecord> {
  const completedAt = new Date().toISOString();
  const record: DebriefRecord = {
    ...debrief,
    date,
    completedAt,
  };

  const { data, error } = await supabase
    .from("daily_debriefs")
    .upsert(
      {
        user_id: userId,
        debrief_date: date,
        submission: debrief,
        completed_at: completedAt,
      },
      { onConflict: "user_id,debrief_date" },
    )
    .select("*")
    .single();

  if (error || !data) {
    throw error ?? new Error("Failed to save debrief");
  }

  await syncEvidenceForDebrief(
    supabase,
    userId,
    (data as DebriefRow).id,
    record,
  );

  return record;
}

export async function fetchTomorrowOnePercent(
  supabase: SupabaseClient,
  userId: string,
): Promise<string> {
  const history = await fetchDebriefHistory(supabase, userId);
  const today = getCalendarDateKey();
  const sorted = history
    .filter((entry) => entry.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return sorted[0]?.tomorrowOnePercent ?? "";
}
