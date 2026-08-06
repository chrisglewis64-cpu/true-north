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
  ESTABLISHING_MESSAGE,
  TREND_LOOKBACK_DAYS,
  type IdentityAlignmentInput,
  type IdentityAlignmentResult,
  type IdentityAlignmentTrend,
} from "@/lib/identity-alignment/types";
import { getLocalDateString } from "@/lib/database/utils";

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
    return {
      established: false,
      alignment: null,
      horizons: null,
      trend: null,
      message: ESTABLISHING_MESSAGE,
    };
  }

  const horizons = calculateHorizons(input, asOfDate);
  const alignment = combineHorizons(horizons);
  const precise = combineHorizonsPrecise(horizons);
  const trend = computeTrend(input, asOfDate, precise);

  return {
    established: true,
    alignment,
    horizons,
    trend,
    message: getIdentityMessage(alignment, asOfDate),
  };
}
