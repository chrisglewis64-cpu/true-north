import { getWeekStart } from "@/lib/bearings/week";
import { getLocalDateString } from "@/lib/database/utils";
import type { DatedDailyDebrief } from "@/lib/compass/types";
import type { Standard } from "@/types/standard";

export type StandardWeekStat = {
  statement: string;
  yesCount: number;
  noCount: number;
};

export type WeeklySummary = {
  weekStart: string;
  weekLabel: string;
  honoured: StandardWeekStat | null;
  drifted: StandardWeekStat | null;
  strongestTheme: string;
  attentionTheme: string;
  alignmentDeltaLabel: string;
  totalYes: number;
  totalNo: number;
  debriefDays: number;
};

function shiftDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

function formatWeekLabel(weekStart: string): string {
  const end = shiftDays(weekStart, 6);
  const startDate = parseLocal(weekStart);
  const endDate = parseLocal(end);

  const startFmt = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
  }).format(startDate);
  const endFmt = new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(endDate);

  return `${startFmt} – ${endFmt}`;
}

function parseLocal(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Map a standard statement to a short theme word for the summary.
 */
export function themeFromStandard(statement: string): string {
  const lower = statement.toLowerCase();
  if (lower.includes("god") || lower.includes("faith") || lower.includes("scripture")) {
    return "Faith";
  }
  if (lower.includes("family")) {
    return "Family";
  }
  if (lower.includes("word") || lower.includes("right") || lower.includes("integrity")) {
    return "Integrity";
  }
  if (lower.includes("discipline") || lower.includes("comfort")) {
    return "Discipline";
  }
  if (lower.includes("excellence") || lower.includes("finish") || lower.includes("improve")) {
    return "Excellence";
  }
  const words = statement.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return words[1] ? capitalize(words[1]) : "Character";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Build a thoughtful weekly summary from Daily Debrief history.
 * No charts. No gamification. Reflection only.
 */
export function buildWeeklySummary(
  debriefHistory: DatedDailyDebrief[],
  standards: Standard[],
  weekStart = getWeekStart()
): WeeklySummary {
  const weekEnd = shiftDays(weekStart, 6);
  const weekDebriefs = debriefHistory.filter(
    (entry) =>
      entry.debriefDate >= weekStart && entry.debriefDate <= weekEnd
  );

  const stats = new Map<string, StandardWeekStat>();

  for (const standard of standards) {
    stats.set(standard.statement, {
      statement: standard.statement,
      yesCount: 0,
      noCount: 0,
    });
  }

  for (const { debrief } of weekDebriefs) {
    for (const entry of debrief.standards) {
      const current = stats.get(entry.statement) ?? {
        statement: entry.statement,
        yesCount: 0,
        noCount: 0,
      };
      if (entry.answer === "yes") {
        current.yesCount += 1;
      } else if (entry.answer === "no") {
        current.noCount += 1;
      }
      stats.set(entry.statement, current);
    }
  }

  const list = [...stats.values()];
  const honoured =
    [...list].sort((a, b) => b.yesCount - a.yesCount || a.noCount - b.noCount)[0] ??
    null;
  const drifted =
    [...list].sort((a, b) => b.noCount - a.noCount || a.yesCount - b.yesCount)[0] ??
    null;

  const totalYes = list.reduce((sum, item) => sum + item.yesCount, 0);
  const totalNo = list.reduce((sum, item) => sum + item.noCount, 0);
  const answered = totalYes + totalNo;
  const alignmentPct = answered === 0 ? 0 : (totalYes / answered) * 100;

  // Present as a calm delta vs a neutral 70% baseline — not a game score.
  const delta = alignmentPct - 70;
  const alignmentDeltaLabel =
    answered === 0
      ? "—"
      : `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`;

  const strongest =
    honoured && honoured.yesCount > 0
      ? themeFromStandard(honoured.statement)
      : "Character";
  const attention =
    drifted && drifted.noCount > 0
      ? themeFromStandard(drifted.statement)
      : "Consistency";

  return {
    weekStart,
    weekLabel: formatWeekLabel(weekStart),
    honoured: honoured && honoured.yesCount > 0 ? honoured : null,
    drifted: drifted && drifted.noCount > 0 ? drifted : null,
    strongestTheme: strongest,
    attentionTheme: attention,
    alignmentDeltaLabel,
    totalYes,
    totalNo,
    debriefDays: weekDebriefs.length,
  };
}
