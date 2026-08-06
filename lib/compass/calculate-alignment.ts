/**
 * @deprecated Prefer `calculateIdentityAlignment` from `@/lib/identity-alignment`.
 * Thin compatibility wrapper for existing imports.
 */

import {
  calculateIdentityAlignment,
  ESTABLISHING_MESSAGE,
  type IdentityAlignmentInput,
  type IdentityAlignmentResult,
} from "@/lib/identity-alignment";
import type { CompassAlignment } from "@/lib/compass/alignment";
import { MIN_DEBRIEFS_FOR_HEADING } from "@/lib/compass/types";

export {
  ESTABLISHING_MESSAGE as INSUFFICIENT_DATA_MESSAGE,
  MIN_DEBRIEFS_FOR_HEADING,
};

export type CalculateAlignmentInput = IdentityAlignmentInput;

export type CalculateAlignmentResult = {
  established: boolean;
  alignment: CompassAlignment | null;
  message?: string;
  trend?: IdentityAlignmentResult["trend"];
  horizons?: IdentityAlignmentResult["horizons"];
};

export function calculateAlignment(
  input: CalculateAlignmentInput = {}
): CalculateAlignmentResult {
  const result = calculateIdentityAlignment(input);

  return {
    established: result.established,
    alignment: result.alignment,
    message: result.message,
    trend: result.trend,
    horizons: result.horizons,
  };
}

/** @deprecated Use calculateIdentityAlignment result. */
export const PLACEHOLDER_ALIGNMENT: CompassAlignment = 94;
