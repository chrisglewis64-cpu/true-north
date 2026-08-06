import { getLocalDateString } from "@/lib/database/utils";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";
import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { Mission } from "@/types/mission";
import type { MissionIntent } from "@/types/mission-intent";
import type { CompassHeading } from "@/types/compass";

export type AlignmentFocus = {
  statusLabel: string;
  reasons: string[];
  recommendation: string;
};

type AlignmentFocusInput = {
  established: boolean;
  alignment: number | null;
  todaysMissionIntent: MissionIntent | null;
  todaysDebrief: DailyDebrief | null;
  currentMission: Mission | null;
  dailyDebriefHistory: DatedDailyDebrief[];
  missionIntentHistory: DatedMissionIntent[];
  evidenceCountToday: number;
};

function shiftLocalDate(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
}

function hasDebriefOnDate(
  history: DatedDailyDebrief[],
  date: string,
  todaysDebrief: DailyDebrief | null,
  today: string
): boolean {
  if (date === today && todaysDebrief) {
    return true;
  }
  return history.some((entry) => entry.debriefDate === date);
}

function standardsMissedThisWeek(history: DatedDailyDebrief[]): boolean {
  const today = getLocalDateString();
  const weekStart = shiftLocalDate(today, -6);
  const recent = history.filter(
    (entry) => entry.debriefDate >= weekStart && entry.debriefDate <= today
  );

  return recent.some((entry) =>
    entry.debrief.standards.some((standard) => standard.answer === "no")
  );
}

function statusLabelForHeading(heading: CompassHeading | null): string {
  if (!heading) {
    return "Heading not yet established";
  }

  switch (heading) {
    case "true_north":
      return "On course";
    case "drifting":
      return "Slightly off course";
    case "off_course":
    case "lost":
      return "Off course";
  }
}

/**
 * Builds a lightweight alignment focus: status reasons + one recommendation.
 * Guides action — never reports scores.
 */
export function getAlignmentFocus(input: AlignmentFocusInput): AlignmentFocus {
  const today = getLocalDateString();
  const yesterday = shiftLocalDate(today, -1);
  const heading =
    input.established && input.alignment !== null
      ? getHeadingFromAlignment(input.alignment)
      : null;

  if (!input.established) {
    return {
      statusLabel: statusLabelForHeading(null),
      reasons: ["Not enough Daily Debriefs yet to establish your heading."],
      recommendation: "Complete today's debrief.",
    };
  }

  const hasIntentToday = Boolean(
    input.todaysMissionIntent ||
      input.missionIntentHistory.some((entry) => entry.intentDate === today)
  );
  const hasDebriefToday = hasDebriefOnDate(
    input.dailyDebriefHistory,
    today,
    input.todaysDebrief,
    today
  );
  const skippedYesterday = !hasDebriefOnDate(
    input.dailyDebriefHistory,
    yesterday,
    null,
    today
  );

  if (heading === "true_north") {
    return {
      statusLabel: statusLabelForHeading(heading),
      reasons: ["Living in alignment with My Standard."],
      recommendation: hasDebriefToday
        ? "Keep moving."
        : "Complete today's debrief.",
    };
  }

  const reasons: string[] = [];

  if (!hasIntentToday) {
    reasons.push("Mission neglected today");
  }
  if (input.evidenceCountToday === 0) {
    reasons.push("No evidence recorded");
  }
  if (standardsMissedThisWeek(input.dailyDebriefHistory)) {
    reasons.push("Standards missed this week");
  }
  if (skippedYesterday) {
    reasons.push("Debrief skipped yesterday");
  }

  if (reasons.length === 0) {
    reasons.push("A small correction will restore your bearing.");
  }

  let recommendation = "Take the next right action.";
  if (!hasDebriefToday) {
    recommendation = "Complete today's debrief.";
  } else if (!hasIntentToday) {
    recommendation = "Recommit to today's intent.";
  } else if (input.evidenceCountToday === 0) {
    recommendation = "Record one piece of evidence.";
  }

  return {
    statusLabel: statusLabelForHeading(heading),
    reasons: reasons.slice(0, 4),
    recommendation,
  };
}
