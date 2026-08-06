import type { DailyDebriefDraft } from "@/types/daily-debrief";

export type Step1Errors = {
  answer?: string;
};

export type Step2Errors = {
  biggestWin?: string;
  biggestLesson?: string;
};

export type Step3Errors = {
  tomorrowOnePercent?: string;
  tomorrowPriority?: string;
};

export function validateStep1Standard(
  draft: DailyDebriefDraft
): { isValid: boolean; errors: Step1Errors } {
  const entry = draft.standards[draft.standardIndex];

  if (entry.answer === null) {
    return {
      isValid: false,
      errors: { answer: "Select Yes or No before continuing." },
    };
  }

  return { isValid: true, errors: {} };
}

export function validateStep2(
  draft: DailyDebriefDraft
): { isValid: boolean; errors: Step2Errors; summary?: string } {
  const errors: Step2Errors = {};
  let issueCount = 0;

  if (!draft.biggestWin.trim()) {
    errors.biggestWin = "Name your biggest win today.";
    issueCount += 1;
  }

  if (!draft.biggestLesson.trim()) {
    errors.biggestLesson = "Name your biggest lesson today.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors,
    summary: "Both reflection fields are required.",
  };
}

export function validateStep3(
  draft: DailyDebriefDraft
): { isValid: boolean; errors: Step3Errors; summary?: string } {
  const errors: Step3Errors = {};
  let issueCount = 0;

  if (!draft.tomorrowOnePercent.trim()) {
    errors.tomorrowOnePercent = "Set one improvement for tomorrow.";
    issueCount += 1;
  }

  if (!draft.tomorrowPriority.trim()) {
    errors.tomorrowPriority = "Set one priority for tomorrow.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors,
    summary: "Both tomorrow fields are required.",
  };
}
