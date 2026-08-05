import type { CompassHeading } from "@/types/compass";

type AlignmentPlaceholders = {
  strongestStandard: string;
  areaToImprove: string;
  todaysRecommendation: string;
};

const PLACEHOLDERS: Record<CompassHeading, AlignmentPlaceholders> = {
  "true-north": {
    strongestStandard: "Keep My Word",
    areaToImprove: "Choose Discipline Over Comfort",
    todaysRecommendation: "Review every purchase before spending.",
  },
  drifting: {
    strongestStandard: "Keep My Word",
    areaToImprove: "Choose Discipline Over Comfort",
    todaysRecommendation: "Review every purchase before spending.",
  },
  "off-course": {
    strongestStandard: "Keep My Word",
    areaToImprove: "Choose Discipline Over Comfort",
    todaysRecommendation: "Review every purchase before spending.",
  },
  lost: {
    strongestStandard: "Keep My Word",
    areaToImprove: "Choose Discipline Over Comfort",
    todaysRecommendation: "Review every purchase before spending.",
  },
};

export function getAlignmentPlaceholders(
  heading: CompassHeading
): AlignmentPlaceholders {
  return PLACEHOLDERS[heading];
}
