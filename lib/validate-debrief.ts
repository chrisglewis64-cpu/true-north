import type { DebriefFormState, DebriefStep } from "@/lib/debrief-form";

export type StandardFieldErrors = {
  answer?: string;
  evidence?: string;
};

export type DebriefFieldErrors = {
  standards: Record<number, StandardFieldErrors>;
  biggestWin?: string;
  biggestLesson?: string;
  tomorrowOnePercent?: string;
  tomorrowPriority?: string;
  courseCorrection?: string;
};

export type DebriefValidationResult = {
  isValid: boolean;
  errors: DebriefFieldErrors;
  summary?: string;
};

const EMPTY_ERRORS: DebriefFieldErrors = { standards: {} };

function issueSummary(count: number): string | undefined {
  if (count === 0) {
    return undefined;
  }

  return count === 1
    ? "One required field needs your attention."
    : `${count} required fields need your attention.`;
}

export function validateDebriefStandardStep(
  form: DebriefFormState,
  index: number
): DebriefValidationResult {
  const entry = form.standards[index];
  const errors: DebriefFieldErrors = { standards: {} };

  if (!entry || entry.answer === null) {
    errors.standards[index] = {
      answer: "Select Yes or No.",
    };

    return {
      isValid: false,
      errors,
      summary: "Answer whether you lived this standard today.",
    };
  }

  return { isValid: true, errors: EMPTY_ERRORS };
}

export function validateDebriefReflectionStep(
  form: DebriefFormState
): DebriefValidationResult {
  const errors: DebriefFieldErrors = { standards: {} };
  let issueCount = 0;

  if (!form.biggestWin.trim()) {
    errors.biggestWin = "Name your biggest win today.";
    issueCount += 1;
  }

  if (!form.biggestLesson.trim()) {
    errors.biggestLesson = "Name your biggest lesson today.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: EMPTY_ERRORS };
  }

  return {
    isValid: false,
    errors,
    summary: issueSummary(issueCount),
  };
}

export function validateDebriefTomorrowStep(
  form: DebriefFormState
): DebriefValidationResult {
  const errors: DebriefFieldErrors = { standards: {} };
  let issueCount = 0;

  if (!form.tomorrowOnePercent.trim()) {
    errors.tomorrowOnePercent = "Set one improvement for tomorrow.";
    issueCount += 1;
  }

  if (!form.tomorrowPriority.trim()) {
    errors.tomorrowPriority = "Name tomorrow's priority.";
    issueCount += 1;
  }

  if (!form.courseCorrection.trim()) {
    errors.courseCorrection = "Identify a course correction for tomorrow.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: EMPTY_ERRORS };
  }

  return {
    isValid: false,
    errors,
    summary: issueSummary(issueCount),
  };
}

export function validateDebrief(form: DebriefFormState): DebriefValidationResult {
  const errors: DebriefFieldErrors = { standards: {} };
  let issueCount = 0;

  form.standards.forEach((entry, index) => {
    if (entry.answer === null) {
      errors.standards[index] = { answer: "Select Yes or No." };
      issueCount += 1;
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

  if (!form.tomorrowPriority.trim()) {
    errors.tomorrowPriority = "Name tomorrow's priority.";
    issueCount += 1;
  }

  if (!form.courseCorrection.trim()) {
    errors.courseCorrection = "Identify a course correction for tomorrow.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: EMPTY_ERRORS };
  }

  return {
    isValid: false,
    errors,
    summary: issueSummary(issueCount),
  };
}

export function validateDebriefStep(
  step: DebriefStep,
  form: DebriefFormState,
  standardIndex = 0
): DebriefValidationResult {
  switch (step) {
    case 1:
      return validateDebriefStandardStep(form, standardIndex);
    case 2:
      return validateDebriefReflectionStep(form);
    case 3:
      return validateDebriefTomorrowStep(form);
    case 4:
      return { isValid: true, errors: EMPTY_ERRORS };
  }
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
  if (errors.tomorrowPriority) return "field-tomorrowPriority";
  if (errors.courseCorrection) return "field-courseCorrection";

  return null;
}
