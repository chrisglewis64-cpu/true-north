import { getHeadingFromAlignment } from "@/lib/compass/alignment";
import type { CompassHeading } from "@/types/compass";

const IDENTITY_MESSAGES: Record<CompassHeading, readonly string[]> = {
  true_north: [
    "Living Your Standard",
    "Back on Course",
    "Consistency Building Character",
  ],
  drifting: [
    "Minor Drift Detected",
    "Returning to True North",
    "Consistency Building Character",
  ],
  off_course: [
    "Realigning",
    "Returning to True North",
    "Minor Drift Detected",
  ],
  lost: [
    "Realigning",
    "Returning to True North",
    "Realigning",
  ],
};

function hashSeed(seed: string): number {
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

/**
 * Returns one identity-centred message for the given Identity Alignment value.
 * Avoids gamified language (Score, XP, Level, Streak, Points).
 */
export function getIdentityMessage(
  alignment: number,
  rotationSeed?: string
): string {
  const heading = getHeadingFromAlignment(alignment);
  const messages = IDENTITY_MESSAGES[heading];
  const seed = `${heading}:${rotationSeed ?? ""}:${alignment}`;
  const index = hashSeed(seed) % messages.length;
  return messages[index];
}

export function formatTrendLabel(delta: number): string {
  const rounded = Math.round(delta * 10) / 10;
  const absolute = Math.abs(rounded).toFixed(1);

  if (rounded > 0) {
    return `▲ +${absolute} this week`;
  }

  if (rounded < 0) {
    return `▼ -${absolute} this week`;
  }

  return `— 0.0 this week`;
}
