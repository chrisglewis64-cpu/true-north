export type MissionIntentMode = "suggest" | "custom";

export type MissionIntentValidationInput = {
  mode: MissionIntentMode;
  suggestion: string;
  customText: string;
  isSelected: boolean;
};

export type MissionIntentFieldErrors = {
  commitment?: string;
};

export type MissionIntentValidationResult = {
  isValid: boolean;
  errors: MissionIntentFieldErrors;
  summary?: string;
};

export function validateMissionIntent(
  input: MissionIntentValidationInput
): MissionIntentValidationResult {
  if (input.mode === "custom") {
    if (!input.customText.trim()) {
      return {
        isValid: false,
        errors: {
          commitment: "Write your commitment before beginning.",
        },
        summary: "Your commitment is required to begin the mission.",
      };
    }

    return { isValid: true, errors: {} };
  }

  if (!input.isSelected) {
    return {
      isValid: false,
      errors: {
        commitment: "Select a commitment with Use This, or write your own.",
      },
      summary: "Choose your commitment before beginning the mission.",
    };
  }

  if (!input.suggestion.trim()) {
    return {
      isValid: false,
      errors: {
        commitment: "Select a valid commitment to continue.",
      },
      summary: "Choose your commitment before beginning the mission.",
    };
  }

  return { isValid: true, errors: {} };
}
