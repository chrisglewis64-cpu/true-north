import {
  combineHorizons,
  combineHorizonsPrecise,
} from "@/lib/identity-alignment/combine";
import { shiftLocalDate } from "@/lib/identity-alignment/date-utils";
import { calculateHorizons } from "@/lib/identity-alignment/horizons";
import {
  formatTrendLabel,
  getIdentityMessage,
} from "@/lib/identity-alignment/messaging";
import {
  indexDebriefsByDate,
  indexIntentsByDate,
} from "@/lib/identity-alignment/score-day";
import {
  ESTABLISHING_MESSAGE,
  TREND_LOOKBACK_DAYS,
  type IdentityAlignmentInput,
  type IdentityAlignmentResult,
  type IdentityAlignmentTrend,
} from "@/lib/identity-alignment/types";
import { getIdentityInsight } from "@/lib/identity-insight";
import { getLocalDateString } from "@/lib/database/utils";
import type { DailyDebrief } from "@/types/daily-debrief";

function hasAnyHistory(input: IdentityAlignmentInput, asOfDate: string): boolean {
  const intents = input.missionIntents ?? [];
  const debriefs = input.dailyDebriefs ?? [];

  return (
    intents.some((entry) => entry.intentDate <= asOfDate) ||
    debriefs.some((entry) => entry.debriefDate <= asOfDate)
  );
}

function computeTrend(
  input: IdentityAlignmentInput,
  asOfDate: string,
  currentPrecise: number
): IdentityAlignmentTrend {
  const weekAgo = shiftLocalDate(asOfDate, -TREND_LOOKBACK_DAYS);

  if (!hasAnyHistory(input, weekAgo)) {
    return {
      delta: 0,
      label: formatTrendLabel(0),
    };
  }

  const pastHorizons = calculateHorizons(input, weekAgo);
  const pastPrecise = combineHorizonsPrecise(pastHorizons);
  const delta = currentPrecise - pastPrecise;

  return {
    delta,
    label: formatTrendLabel(delta),
  };
}

function hasEvidenceInDebrief(debrief: DailyDebrief | undefined): boolean {
  if (!debrief) {
    return false;
  }

  if (debrief.biggestWin.trim() || debrief.biggestLesson.trim()) {
    return true;
  }

  return debrief.standards.some((standard) => standard.evidence.trim().length > 0);
}

function buildInsightContext(
  input: IdentityAlignmentInput,
  asOfDate: string,
  established: boolean,
  alignment: number | null,
  trendDelta: number
) {
  const intentsByDate = indexIntentsByDate(input.missionIntents ?? []);
  const debriefsByDate = indexDebriefsByDate(input.dailyDebriefs ?? []);
  const todayDebrief = debriefsByDate.get(asOfDate)?.debrief;

  const mission = input.currentMission;
  const missionProgressToday = mission
    ? (
        {
          on_track: 100,
          complete: 90,
          at_risk: 55,
          off_course: 25,
        } as const
      )[mission.missionStatus]
    : 0;

  return {
    asOfDate,
    established,
    alignment,
    trendDelta,
    hasMorningCommitmentToday: intentsByDate.has(asOfDate),
    hasEvidenceToday: hasEvidenceInDebrief(todayDebrief),
    hasDebriefToday: debriefsByDate.has(asOfDate),
    missionProgressToday,
  };
}

/**
 * Identity Alignment — how closely recent actions align with the person
 * the user committed to becoming.
 *
 * Today 20% · Recent 30 days 50% · Lifetime 30%.
 * Isolated from UI so weights can change without touching Compass components.
 */
export function calculateIdentityAlignment(
  input: IdentityAlignmentInput = {}
): IdentityAlignmentResult {
  const asOfDate = input.asOfDate ?? getLocalDateString();

  if (!hasAnyHistory(input, asOfDate)) {
    const insight = getIdentityInsight(
      buildInsightContext(input, asOfDate, false, null, 0)
    );

    return {
      established: false,
      alignment: null,
      horizons: null,
      trend: null,
      message: ESTABLISHING_MESSAGE,
      insight,
    };
  }

  const horizons = calculateHorizons(input, asOfDate);
  const alignment = combineHorizons(horizons);
  const precise = combineHorizonsPrecise(horizons);
  const trend = computeTrend(input, asOfDate, precise);
  const insight = getIdentityInsight(
    buildInsightContext(input, asOfDate, true, alignment, trend.delta)
  );

  return {
    established: true,
    alignment,
    horizons,
    trend,
    message: getIdentityMessage(alignment, asOfDate),
    insight,
  };
}
