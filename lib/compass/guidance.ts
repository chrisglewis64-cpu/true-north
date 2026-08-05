import type { CompassHeading } from "@/types/compass";

const GUIDANCE: Record<CompassHeading, string> = {
  "true-north": "Stay the course.",
  drifting: "Small corrections restore direction.",
  "off-course": "Re-anchor your intent.",
  lost: "Return to your Standard.",
};

export function getCompassGuidance(heading: CompassHeading): string {
  return GUIDANCE[heading];
}
