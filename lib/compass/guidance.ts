import type { CompassHeading } from "@/types/compass";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";

type GuidanceCategory = CompassHeading;

const GUIDANCE_MESSAGES: Record<GuidanceCategory, readonly string[]> = {
  true_north: [
    "Keep moving.",
    "Stay the course.",
    "Hold the line you have set.",
    "Continue with quiet consistency.",
  ],
  drifting: [
    "Reconnect with today's intent.",
    "A gentle adjustment will suffice.",
    "Notice the drift early. Correct now.",
    "Tend to the small things today.",
  ],
  off_course: [
    "One small decision puts you back on course.",
    "Return your attention to what matters most.",
    "One Standard. One clear action.",
    "Reconnect with your Standard this evening.",
  ],
  lost: [
    "One small decision puts you back on course.",
    "Begin again with one principle.",
    "One step toward alignment is enough today.",
    "Ground yourself before you move forward.",
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

function pickGuidance(
  messages: readonly string[],
  seed: string
): string {
  const index = hashSeed(seed) % messages.length;
  return messages[index];
}

function defaultRotationSeed(): string {
  return new Date().toISOString().split("T")[0];
}

export type GuidanceOptions = {
  /**
   * Stable seed for message rotation within a category.
   * Defaults to today's date so guidance stays consistent through the day.
   */
  rotationSeed?: string;
};

/**
 * Returns one calm guidance message for the given alignment value.
 * Messages rotate within the alignment category using a stable seed —
 * varied day to day, steady across re-renders.
 */
export function getGuidanceFromAlignment(
  alignment: number,
  options: GuidanceOptions = {}
): string {
  const category = getHeadingFromAlignment(alignment);
  const messages = GUIDANCE_MESSAGES[category];
  const rotationSeed = options.rotationSeed ?? defaultRotationSeed();
  const seed = `${category}:${rotationSeed}:${alignment}`;

  return pickGuidance(messages, seed);
}

/** Total guidance messages across all alignment categories. */
export const GUIDANCE_MESSAGE_COUNT = Object.values(GUIDANCE_MESSAGES).reduce(
  (total, messages) => total + messages.length,
  0
);
