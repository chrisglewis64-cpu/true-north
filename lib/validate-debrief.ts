import type { DebriefFormState } from "@/lib/debrief-form";

export type StandardFieldErrors = {
  answer?: string;
  evidence?: string;
};

export type DebriefFieldErrors = {
  standards: Record<number, StandardFieldErrors>;
  biggestWin?: string;
  biggestLesson?: string;
  tomorrowOnePercent?: string;
};

export type DebriefValidationResult = {
  isValid: boolean;
  errors: DebriefFieldErrors;
  summary?: string;
};

const EMPTY_ERRORS: DebriefFieldErrors = { standards: {} };

export function validateDebrief(form: DebriefFormState): DebriefValidationResult {
  const errors: DebriefFieldErrors = { standards: {} };
  let issueCount = 0;

  form.standards.forEach((entry, index) => {
    const fieldErrors: StandardFieldErrors = {};

    if (entry.answer === null) {
      fieldErrors.answer = "Select Yes or No.";
      issueCount += 1;
    }

    if (!entry.evidence.trim()) {
      fieldErrors.evidence = "Provide evidence for this standard.";
      issueCount += 1;
    }

    if (Object.keys(fieldErrors).length > 0) {
      errors.standards[index] = fieldErrors;
    }
  });

  if (!form.biggestWin.trim()) {
    errors.biggestWin = "Name your biggest win today.";
    issueCount += 1;
  }

  if (!form.biggestLesson.trim()) {
    errors.biggestLesson = "Name your biggest lesson today.";
    issueCount += 1;
  }

  if (!form.tomorrowOnePercent.trim()) {
    errors.tomorrowOnePercent = "Set one improvement for tomorrow.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: EMPTY_ERRORS };
  }

  return {
    isValid: false,
    errors,
    summary:
      issueCount === 1
        ? "One required field needs your attention."
        : `${issueCount} required fields need your attention.`,
  };
}

export function getFirstDebriefErrorId(
  errors: DebriefFieldErrors,
  standardCount: number
): string | null {
  for (let index = 0; index < standardCount; index += 1) {
    const standardErrors = errors.standards[index];
    if (standardErrors?.answer) return `standard-${index}-answer`;
    if (standardErrors?.evidence) return `standard-${index}-evidence`;
  }

  if (errors.biggestWin) return "field-biggestWin";
  if (errors.biggestLesson) return "field-biggestLesson";
  if (errors.tomorrowOnePercent) return "field-tomorrowOnePercent";

  return null;
}
