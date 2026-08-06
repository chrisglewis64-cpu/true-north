import type { DailyDebriefDraft } from "@/types/daily-debrief";

export type Step1Errors = {
  answer?: string;
  evidence?: string;
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

  if (entry.answer === "yes" && !entry.evidence.trim()) {
    return {
      isValid: false,
      errors: {
        evidence: "Record the proof. This becomes permanent Evidence.",
      },
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
    errors.biggestWin = "Name where you grew today.";
    issueCount += 1;
  }

  if (!draft.biggestLesson.trim()) {
    errors.biggestLesson = "Name what reflection taught you.";
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
    errors.tomorrowOnePercent = "Set tomorrow's alignment.";
    issueCount += 1;
  }

  if (!draft.tomorrowPriority.trim()) {
    errors.tomorrowPriority = "Set tomorrow's priority.";
    issueCount += 1;
  }

  if (issueCount === 0) {
    return { isValid: true, errors: {} };
  }

  return {
    isValid: false,
    errors,
    summary: "Both direction fields are required.",
  };
}
