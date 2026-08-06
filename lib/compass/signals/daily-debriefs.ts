import type { AlignmentSignalResult, DatedDailyDebrief } from "@/lib/compass/types";

export function scoreDailyDebriefs(
  debriefs: DatedDailyDebrief[]
): AlignmentSignalResult {
  if (debriefs.length === 0) {
    return { score: 0, available: false };
  }

  let weightedSum = 0;
  let totalWeight = 0;

  debriefs.forEach((entry, index) => {
    const recencyWeight = 1 / (index + 1);
    const standards = entry.debrief.standards;
    const answered = standards.filter((item) => item.answer !== null);
    const yesCount = standards.filter((item) => item.answer === "yes").length;

    const dayScore =
      answered.length > 0 ? (yesCount / answered.length) * 100 : 50;

    weightedSum += dayScore * recencyWeight;
    totalWeight += recencyWeight;
  });

  return {
    score: totalWeight > 0 ? weightedSum / totalWeight : 50,
    available: true,
  };
}
