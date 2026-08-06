export type { CompassAlignment } from "@/lib/compass/alignment";
export {
  getHeadingFromAlignment,
  getNeedleRotationFromAlignment,
} from "@/lib/compass/alignment";

export {
  calculateAlignment,
  INSUFFICIENT_DATA_MESSAGE,
  MIN_DEBRIEFS_FOR_HEADING,
  PLACEHOLDER_ALIGNMENT,
  type CalculateAlignmentInput,
  type CalculateAlignmentResult,
} from "@/lib/compass/calculate-alignment";

export {
  getGuidanceFromAlignment,
  GUIDANCE_MESSAGE_COUNT,
  type GuidanceOptions,
} from "@/lib/compass/guidance";

export {
  getAlignmentFocus,
  type AlignmentFocus,
} from "@/lib/compass/alignment-focus";

/** Identity Alignment is the source of truth for Compass calculation. */
export {
  calculateIdentityAlignment,
  IDENTITY_ALIGNMENT_WEIGHTS,
  type IdentityAlignmentResult,
} from "@/lib/identity-alignment";

export {
  getIdentityInsight,
  setIdentityInsightProvider,
  type IdentityInsight,
} from "@/lib/identity-insight";
