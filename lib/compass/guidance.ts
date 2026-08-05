import type { CompassHeading } from "@/types/compass";

const GUIDANCE: Record<CompassHeading, string[]> = {
  "true-north": [
    "Stay the course.",
    "Hold the line.",
    "Keep your rhythm.",
  ],
  drifting: [
    "One decision changes your heading.",
    "Correct course today.",
    "Tighten one thread.",
  ],
  "off-course": [
    "Return to your Standard.",
    "Choose discipline today.",
    "Re-anchor your intent.",
  ],
  lost: [
    "Return to your Standard.",
    "Begin with Mission Intent.",
    "One decision changes your heading.",
  ],
};

export function getCompassGuidance(heading: CompassHeading, date = new Date()): string {
  const options = GUIDANCE[heading];
  const dayIndex = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(2024, 0, 1)) /
      86_400_000
  );

  return options[dayIndex % options.length];
}
