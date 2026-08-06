import {
  eachLocalDateInclusive,
  mean,
  shiftLocalDate,
} from "@/lib/identity-alignment/date-utils";
import {
  indexDebriefsByDate,
  indexIntentsByDate,
  scoreDay,
} from "@/lib/identity-alignment/score-day";
import {
  RECENT_ALIGNMENT_DAYS,
  type IdentityAlignmentHorizons,
  type IdentityAlignmentInput,
} from "@/lib/identity-alignment/types";

function earliestActivityDate(
  intents: { intentDate: string }[],
  debriefs: { debriefDate: string }[]
): string | null {
  const dates = [
    ...intents.map((entry) => entry.intentDate),
    ...debriefs.map((entry) => entry.debriefDate),
  ];

  if (dates.length === 0) {
    return null;
  }

  return dates.reduce((earliest, date) =>
    date < earliest ? date : earliest
  );
}

function filterToAsOf<T extends { intentDate?: string; debriefDate?: string }>(
  entries: T[],
  asOfDate: string,
  dateKey: "intentDate" | "debriefDate"
): T[] {
  return entries.filter((entry) => {
    const date = entry[dateKey];
    return typeof date === "string" && date <= asOfDate;
  });
}

/**
 * Computes Today / Recent (30d) / Lifetime horizon scores as of a local date.
 */
export function calculateHorizons(
  input: IdentityAlignmentInput,
  asOfDate: string
): IdentityAlignmentHorizons {
  const intents = filterToAsOf(
    input.missionIntents ?? [],
    asOfDate,
    "intentDate"
  );
  const debriefs = filterToAsOf(
    input.dailyDebriefs ?? [],
    asOfDate,
    "debriefDate"
  );

  const intentsByDate = indexIntentsByDate(intents);
  const debriefsByDate = indexDebriefsByDate(debriefs);

  const dayContext = {
    asOfDate,
    intentsByDate,
    debriefsByDate,
    currentMission: input.currentMission,
  };

  const today = scoreDay({ ...dayContext, date: asOfDate });

  const recentStart = shiftLocalDate(asOfDate, -(RECENT_ALIGNMENT_DAYS - 1));
  const recentDates = eachLocalDateInclusive(recentStart, asOfDate);
  const recent = mean(
    recentDates.map((date) => scoreDay({ ...dayContext, date }))
  );

  const lifetimeStart = earliestActivityDate(intents, debriefs);
  let lifetime: number | null = null;

  if (lifetimeStart && lifetimeStart <= asOfDate) {
    const lifetimeDates = eachLocalDateInclusive(lifetimeStart, asOfDate);
    lifetime = mean(
      lifetimeDates.map((date) => scoreDay({ ...dayContext, date }))
    );
  }

  return { today, recent, lifetime };
}
