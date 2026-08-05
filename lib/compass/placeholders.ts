import type { CompassHeading } from "@/types/compass";

export type AlignmentExplanation = {
  why: string;
  recommendation: string;
};

const EXPLANATIONS: Record<CompassHeading, AlignmentExplanation> = {
  "true-north": {
    why: "You have been consistently following your Standard.",
    recommendation: "Stay the course today.",
  },
  drifting: {
    why: "Your recent actions have not matched today's Mission Intent.",
    recommendation: "Recommit to today's Mission Intent.",
  },
  "off-course": {
    why: "You have missed several Daily Debriefs this week.",
    recommendation: "Complete today's Daily Debrief.",
  },
  lost: {
    why: "Your recent actions have not matched today's Mission Intent.",
    recommendation: "Return to your Standard.",
  },
};

export function getAlignmentExplanation(
  heading: CompassHeading
): AlignmentExplanation {
  return EXPLANATIONS[heading];
}
