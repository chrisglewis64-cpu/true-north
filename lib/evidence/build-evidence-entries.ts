import type { DebriefRecord } from "@/lib/storage/local-session";

export type EvidenceEntry = {
  id: string;
  label: string;
  date: string;
};

function formatEvidenceDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function buildEvidenceEntries(
  history: readonly DebriefRecord[]
): EvidenceEntry[] {
  const entries: EvidenceEntry[] = [];

  for (const debrief of history) {
    debrief.standards.forEach((standard, index) => {
      const evidence = standard.evidence.trim();
      if (!evidence) {
        return;
      }

      entries.push({
        id: `${debrief.date}-standard-${index}`,
        label: evidence,
        date: debrief.date,
      });
    });

    const win = debrief.biggestWin.trim();
    if (win) {
      entries.push({
        id: `${debrief.date}-win`,
        label: win,
        date: debrief.date,
      });
    }
  }

  return entries.sort((left, right) => {
    if (left.date === right.date) {
      return left.id.localeCompare(right.id);
    }

    return right.date.localeCompare(left.date);
  });
}

export function formatEvidenceEntryDate(dateKey: string): string {
  return formatEvidenceDate(dateKey);
}
