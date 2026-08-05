import type { CompassHeading } from "@/types/compass";

const GUIDANCE: Record<CompassHeading, string> = {
  "true-north": "Stay the course.",
  drifting: "Small corrections restore direction.",
  "off-course": "Recommit to today's intent.",
  lost: "Return to your Standard.",
};

export function getCompassGuidance(heading: CompassHeading): string {
  return GUIDANCE[heading];
}
