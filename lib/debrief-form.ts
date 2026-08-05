export type StandardAnswer = "yes" | "no" | null;

export type StandardEntry = {
  answer: StandardAnswer;
  evidence: string;
};

export type DebriefFormState = {
  standards: StandardEntry[];
  biggestWin: string;
  biggestLesson: string;
  tomorrowOnePercent: string;
};

export type DebriefSubmission = {
  standards: {
    statement: string;
    answer: StandardAnswer;
    evidence: string;
  }[];
  biggestWin: string;
  biggestLesson: string;
  tomorrowOnePercent: string;
};

export function createInitialDebriefState(
  standardCount: number
): DebriefFormState {
  return {
    standards: Array.from({ length: standardCount }, () => ({
      answer: null,
      evidence: "",
    })),
    biggestWin: "",
    biggestLesson: "",
    tomorrowOnePercent: "",
  };
}

export function serializeDebrief(
  form: DebriefFormState,
  statements: readonly string[]
): DebriefSubmission {
  return {
    standards: form.standards.map((entry, index) => ({
      statement: statements[index],
      answer: entry.answer,
      evidence: entry.evidence,
    })),
    biggestWin: form.biggestWin,
    biggestLesson: form.biggestLesson,
    tomorrowOnePercent: form.tomorrowOnePercent,
  };
}
