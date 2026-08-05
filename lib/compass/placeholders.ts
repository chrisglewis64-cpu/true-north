import type { CompassHeading } from "@/types/compass";

type AlignmentPlaceholders = {
  strongestStandard: string;
  areaToImprove: string;
  todaysRecommendation: string;
};

const PLACEHOLDERS: Record<CompassHeading, AlignmentPlaceholders> = {
  "true-north": {
    strongestStandard: "I keep my word.",
    areaToImprove: "Protect the evening debrief window.",
    todaysRecommendation:
      "Maintain your current rhythm. Document one piece of evidence before close.",
  },
  drifting: {
    strongestStandard: "I choose discipline over comfort.",
    areaToImprove: "Complete today's Daily Debrief before tomorrow begins.",
    todaysRecommendation:
      "Close the loop on today with a brief debrief.",
  },
  "off-course": {
    strongestStandard: "I walk with God.",
    areaToImprove: "Re-anchor to your active mission.",
    todaysRecommendation:
      "Set Mission Intent now and name one action tied to your mission.",
  },
  lost: {
    strongestStandard: "I finish what I start.",
    areaToImprove: "Restore the morning commit ritual.",
    todaysRecommendation:
      "Begin with Mission Intent — one sentence is enough to reset heading.",
  },
};

export function getAlignmentPlaceholders(
  heading: CompassHeading
): AlignmentPlaceholders {
  return PLACEHOLDERS[heading];
}
