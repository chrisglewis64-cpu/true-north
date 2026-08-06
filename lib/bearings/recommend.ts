import { SYSTEM_BEARING_LIBRARY, getBearingById } from "@/lib/bearings/library";
import { getWeekDayIndex } from "@/lib/bearings/week";
import type { Bearing, TodaysBearing, WeeklyBearings } from "@/types/bearing";
import type { EvidenceEntry } from "@/types/evidence";
import type { DatedDailyDebrief } from "@/lib/compass/types";
import type { Mission } from "@/types/mission";
import { getLocalDateString } from "@/lib/database/utils";

/**
 * Inputs for the rule-based Bearing recommendation engine.
 * Designed so an AI recommender can later implement the same contract.
 */
export type BearingRecommendationContext = {
  alignment: number | null;
  established: boolean;
  dailyDebriefHistory: DatedDailyDebrief[];
  evidenceEntries: EvidenceEntry[];
  currentMission: Mission | null;
  previousWeeklyBearingIds?: readonly string[];
  date?: Date;
};

export type BearingRecommendation = {
  bearingIds: [string, string, string];
  reasons: string[];
};

const DEFAULT_WEEKLY: [string, string, string] = [
  "bearing-stand-at-alarm",
  "bearing-pray-before-phone",
  "bearing-leave-room-better",
];

function recentMissedStandardStatements(
  history: DatedDailyDebrief[],
  days = 7
): string[] {
  const today = getLocalDateString();
  const cutoff = shiftDays(today, -(days - 1));
  const missed = new Set<string>();

  for (const entry of history) {
    if (entry.debriefDate < cutoff || entry.debriefDate > today) continue;
    for (const standard of entry.debrief.standards) {
      if (standard.answer === "no") {
        missed.add(standard.statement.toLowerCase());
      }
    }
  }

  return [...missed];
}

function shiftDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

function pickByTheme(
  themes: RegExp[],
  exclude: Set<string>
): Bearing | undefined {
  return SYSTEM_BEARING_LIBRARY.find(
    (bearing) =>
      !exclude.has(bearing.id) &&
      themes.some((theme) => theme.test(bearing.statement))
  );
}

/**
 * Rule-based weekly Bearing recommendations.
 * Easy to extend — replace or wrap with AI later without changing callers.
 */
export function recommendWeeklyBearings(
  context: BearingRecommendationContext
): BearingRecommendation {
  const selected = new Set<string>();
  const reasons: string[] = [];
  const ids: string[] = [];

  const missed = recentMissedStandardStatements(context.dailyDebriefHistory);
  const previous = new Set(context.previousWeeklyBearingIds ?? []);

  // Drift / missed standards → discipline & integrity bearings
  if (
    missed.some((s) => s.includes("discipline") || s.includes("comfort")) ||
    (context.established &&
      context.alignment !== null &&
      context.alignment < 70)
  ) {
    const pick =
      pickByTheme(
        [/bed immediately/i, /alarm sounds/i, /stretch after waking/i],
        selected
      ) ?? getBearingById(DEFAULT_WEEKLY[0]);
    if (pick && !selected.has(pick.id)) {
      ids.push(pick.id);
      selected.add(pick.id);
      reasons.push("Recent drift — restore morning discipline.");
    }
  }

  // Faith / word standards
  if (
    missed.some(
      (s) => s.includes("god") || s.includes("word") || s.includes("right")
    )
  ) {
    const pick = pickByTheme(
      [/pray before/i, /scripture/i, /speak deliberately/i],
      selected
    );
    if (pick) {
      ids.push(pick.id);
      selected.add(pick.id);
      reasons.push("Missed standards — return to integrity in small acts.");
    }
  }

  // Low recent evidence → visible character acts
  const recentEvidence = context.evidenceEntries.filter(
    (entry) => entry.evidenceDate >= shiftDays(getLocalDateString(), -7)
  );
  if (recentEvidence.length < 3) {
    const pick = pickByTheme(
      [/leave every room/i, /smile first/i, /shoes away/i, /trolleys/i],
      selected
    );
    if (pick) {
      ids.push(pick.id);
      selected.add(pick.id);
      reasons.push("Little recent proof — choose bearings you can evidence.");
    }
  }

  // Mission progress soft nudge
  if (
    context.currentMission &&
    (context.currentMission.missionStatus === "at_risk" ||
      context.currentMission.missionStatus === "off_course")
  ) {
    const pick = pickByTheme(
      [/finish one thing/i, /read one page/i, /phone away/i],
      selected
    );
    if (pick) {
      ids.push(pick.id);
      selected.add(pick.id);
      reasons.push("Mission needs focus — small bearings protect direction.");
    }
  }

  // Fill remaining slots; prefer bearings not used last week
  for (const bearing of SYSTEM_BEARING_LIBRARY) {
    if (ids.length >= 3) break;
    if (selected.has(bearing.id)) continue;
    if (previous.has(bearing.id)) continue;
    ids.push(bearing.id);
    selected.add(bearing.id);
  }

  for (const fallbackId of DEFAULT_WEEKLY) {
    if (ids.length >= 3) break;
    if (selected.has(fallbackId)) continue;
    ids.push(fallbackId);
    selected.add(fallbackId);
  }

  if (reasons.length === 0) {
    reasons.push("Steady course — keep shaping character with three bearings.");
  }

  return {
    bearingIds: [ids[0], ids[1], ids[2]] as [string, string, string],
    reasons,
  };
}

/**
 * Pick ONE bearing for today from the week's three.
 * Rotates by weekday, with a light preference for the first recommended slot
 * when alignment is weak.
 */
export function recommendTodaysBearing(
  weekly: WeeklyBearings,
  context: BearingRecommendationContext
): TodaysBearing | null {
  const date = context.date ?? new Date();
  const dateStr = getLocalDateString(date);
  const bearings = weekly.bearingIds
    .map((id) => getBearingById(id))
    .filter((bearing): bearing is Bearing => Boolean(bearing));

  if (bearings.length === 0) {
    return null;
  }

  let index = getWeekDayIndex(date) % bearings.length;
  let reason = "Today's operational guidance.";

  if (
    context.established &&
    context.alignment !== null &&
    context.alignment < 70
  ) {
    index = 0;
    reason = "Correct course with today's bearing.";
  } else if (
    context.evidenceEntries.every((entry) => entry.evidenceDate !== dateStr)
  ) {
    reason = "One clear action. Provide evidence of who you are becoming.";
  }

  return {
    date: dateStr,
    bearing: bearings[index]!,
    reason,
  };
}
