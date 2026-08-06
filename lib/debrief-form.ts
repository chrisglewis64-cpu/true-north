import type {
  DailyDebrief,
  DailyDebriefDraft,
} from "@/types/daily-debrief";
import type { Standard } from "@/types/standard";

export type {
  DailyDebrief,
  DailyDebriefDraft,
  DailyDebriefStandardEntry,
  DailyDebriefState,
  DebriefStep,
  StandardAnswer,
  StandardReviewEntry,
} from "@/types/daily-debrief";

export function createInitialDebriefDraft(
  standardCount: number
): DailyDebriefDraft {
  return {
    step: 1,
    standardIndex: 0,
    standards: Array.from({ length: standardCount }, () => ({
      answer: null,
      evidence: "",
    })),
    biggestWin: "",
    biggestLesson: "",
    tomorrowOnePercent: "",
    tomorrowPriority: "",
    courseCorrection: "",
  };
}

export function serializeDebrief(
  draft: DailyDebriefDraft,
  standards: readonly Standard[]
): DailyDebrief {
  return {
    standards: draft.standards.map((entry, index) => ({
      statement: standards[index]?.statement ?? "",
      answer: entry.answer,
      evidence: entry.evidence,
    })),
    biggestWin: draft.biggestWin,
    biggestLesson: draft.biggestLesson,
    tomorrowOnePercent: draft.tomorrowOnePercent,
    tomorrowPriority: draft.tomorrowPriority,
    courseCorrection: draft.courseCorrection,
    completedAt: new Date().toISOString(),
  };
}
