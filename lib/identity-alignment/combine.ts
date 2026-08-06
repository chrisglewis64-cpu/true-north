import { IDENTITY_ALIGNMENT_WEIGHTS } from "@/lib/identity-alignment/weights";
import {
  clampScore,
  roundAlignment,
} from "@/lib/identity-alignment/date-utils";
import type { IdentityAlignmentHorizons } from "@/lib/identity-alignment/types";

/**
 * Combines temporal horizons into a single Identity Alignment value.
 * Renormalizes when lifetime is unavailable (no recorded history span).
 */
export function combineHorizons(
  horizons: IdentityAlignmentHorizons
): number {
  const { today, recent, lifetime } = horizons;
  const weights = IDENTITY_ALIGNMENT_WEIGHTS;

  if (lifetime === null) {
    const total = weights.today + weights.recent;
    const combined =
      (today * weights.today + recent * weights.recent) / total;
    return roundAlignment(combined);
  }

  const combined =
    today * weights.today +
    recent * weights.recent +
    lifetime * weights.lifetime;

  return roundAlignment(combined);
}

/** Unrounded composite for trend precision (one decimal). */
export function combineHorizonsPrecise(
  horizons: IdentityAlignmentHorizons
): number {
  const { today, recent, lifetime } = horizons;
  const weights = IDENTITY_ALIGNMENT_WEIGHTS;

  if (lifetime === null) {
    const total = weights.today + weights.recent;
    return clampScore(
      (today * weights.today + recent * weights.recent) / total
    );
  }

  return clampScore(
    today * weights.today +
      recent * weights.recent +
      lifetime * weights.lifetime
  );
}
