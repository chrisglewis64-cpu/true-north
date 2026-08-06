import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import { clampScore } from "@/lib/identity-alignment/date-utils";
import type { DailyDebrief } from "@/types/daily-debrief";
import type { Mission, MissionStatus } from "@/types/mission";

const MISSION_STATUS_SCORE: Record<MissionStatus, number> = {
  on_track: 100,
  complete: 90,
  at_risk: 55,
  off_course: 25,
};

export type DayScoreContext = {
  date: string;
  asOfDate: string;
  intentsByDate: Map<string, DatedMissionIntent>;
  debriefsByDate: Map<string, DatedDailyDebrief>;
  currentMission?: Mission | null;
};

function hasMorningCommitment(
  date: string,
  intentsByDate: Map<string, DatedMissionIntent>
): boolean {
  return intentsByDate.has(date);
}

function hasDebriefCompleted(
  date: string,
  debriefsByDate: Map<string, DatedDailyDebrief>
): boolean {
  return debriefsByDate.has(date);
}

function hasEvidenceRecorded(debrief: DailyDebrief | undefined): boolean {
  if (!debrief) {
    return false;
  }

  if (debrief.biggestWin.trim() || debrief.biggestLesson.trim()) {
    return true;
  }

  return debrief.standards.some((standard) => standard.evidence.trim().length > 0);
}

function missionProgressScore(
  date: string,
  asOfDate: string,
  debrief: DailyDebrief | undefined,
  currentMission: Mission | null | undefined
): number {
  if (date === asOfDate) {
    if (!currentMission) {
      return 0;
    }
    return MISSION_STATUS_SCORE[currentMission.missionStatus] ?? 0;
  }

  if (!debrief || debrief.standards.length === 0) {
    return 0;
  }

  const yesCount = debrief.standards.filter(
    (standard) => standard.answer === "yes"
  ).length;

  return clampScore((yesCount / debrief.standards.length) * 100);
}

/**
 * Scores a single local calendar day 0–100 from four equal pillars:
 * Morning Commitment, Mission progress, Evidence, Daily Debrief.
 */
export function scoreDay(context: DayScoreContext): number {
  const { date, asOfDate, intentsByDate, debriefsByDate, currentMission } =
    context;
  const debrief = debriefsByDate.get(date)?.debrief;

  const commitment = hasMorningCommitment(date, intentsByDate) ? 100 : 0;
  const mission = missionProgressScore(
    date,
    asOfDate,
    debrief,
    currentMission
  );
  const evidence = hasEvidenceRecorded(debrief) ? 100 : 0;
  const debriefCompleted = hasDebriefCompleted(date, debriefsByDate) ? 100 : 0;

  return clampScore((commitment + mission + evidence + debriefCompleted) / 4);
}

export function indexIntentsByDate(
  intents: DatedMissionIntent[]
): Map<string, DatedMissionIntent> {
  const map = new Map<string, DatedMissionIntent>();
  for (const entry of intents) {
    map.set(entry.intentDate, entry);
  }
  return map;
}

export function indexDebriefsByDate(
  debriefs: DatedDailyDebrief[]
): Map<string, DatedDailyDebrief> {
  const map = new Map<string, DatedDailyDebrief>();
  for (const entry of debriefs) {
    map.set(entry.debriefDate, entry);
  }
  return map;
}
