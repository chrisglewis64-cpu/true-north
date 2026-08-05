import type { MissionBuilderStep, MissionDraft } from "@/types/mission";

export type MissionFieldErrors = Partial<Record<keyof MissionDraft, string>>;

export type MissionValidationResult = {
  isValid: boolean;
  errors: MissionFieldErrors;
  summary?: string;
};

const STEP_FIELDS: Record<MissionBuilderStep, (keyof MissionDraft)[]> = {
  1: ["name"],
  2: ["purpose"],
  3: ["successCriteria"],
  4: ["missionStatus", "nextMilestone"],
};

function validateField(field: keyof MissionDraft, value: string): string | undefined {
  if (!value.trim()) {
    switch (field) {
      case "name":
        return "Mission name is required.";
      case "purpose":
        return "Purpose is required.";
      case "successCriteria":
        return "Success criteria are required.";
      case "missionStatus":
        return "Mission status is required.";
      case "nextMilestone":
        return "Next milestone is required.";
      default:
        return "This field is required.";
    }
  }

  return undefined;
}

export function validateMissionStep(
  step: MissionBuilderStep,
  draft: MissionDraft
): MissionValidationResult {
  const errors: MissionFieldErrors = {};

  for (const field of STEP_FIELDS[step]) {
    const message = validateField(field, draft[field]);
    if (message) {
      errors[field] = message;
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      summary: "Complete the required fields before continuing.",
    };
  }

  return { isValid: true, errors: {} };
}

export function validateMissionDraft(
  draft: MissionDraft
): MissionValidationResult {
  const errors: MissionFieldErrors = {};

  (Object.keys(draft) as (keyof MissionDraft)[]).forEach((field) => {
    const message = validateField(field, draft[field]);
    if (message) {
      errors[field] = message;
    }
  });

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      summary: "Complete all mission fields before saving.",
    };
  }

  return { isValid: true, errors: {} };
}
