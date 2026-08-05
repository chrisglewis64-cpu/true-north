import type { CompassHeading } from "@/types/compass";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";

type GuidanceCategory = CompassHeading;

const GUIDANCE_MESSAGES: Record<GuidanceCategory, readonly string[]> = {
  true_north: [
    "Stay the course.",
    "Hold the line you have set.",
    "Continue with quiet consistency.",
    "Your rhythm is sound. Protect it.",
    "Steady hands. Clear direction.",
    "Maintain what is working.",
  ],
  drifting: [
    "Small correction required.",
    "A gentle adjustment will suffice.",
    "Notice the drift early. Correct now.",
    "Tend to the small things today.",
    "Recenter before the day gains momentum.",
    "A minor realignment is enough.",
  ],
  off_course: [
    "Refocus on your Standard today.",
    "Return your attention to what matters most.",
    "Pause. Remember who you are becoming.",
    "One Standard. One clear action.",
    "Step back to identity before action.",
    "Reconnect with your Standard this evening.",
  ],
  lost: [
    "Return to your Standard.",
    "Begin again with one principle.",
    "Identity first. Everything else can wait.",
    "One step toward alignment is enough today.",
    "Ground yourself before you move forward.",
    "Start with the man you chose to become.",
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
