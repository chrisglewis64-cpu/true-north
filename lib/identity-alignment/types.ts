import type { DatedDailyDebrief, DatedMissionIntent } from "@/lib/compass/types";
import type { Mission } from "@/types/mission";

export type IdentityAlignmentHorizons = {
  today: number;
  recent: number;
  lifetime: number | null;
};

export type IdentityAlignmentTrend = {
  /** Change in Identity Alignment over the last seven days. */
  delta: number;
  /** Ready-to-render label, e.g. "▲ +1.2 this week". */
  label: string;
};

export type IdentityAlignmentInput = {
  dailyDebriefs?: DatedDailyDebrief[];
  missionIntents?: DatedMissionIntent[];
  currentMission?: Mission | null;
  /** Local calendar date YYYY-MM-DD. Defaults to today. */
  asOfDate?: string;
};

export type IdentityAlignmentResult = {
  /** Enough history exists to show Identity Alignment. */
  established: boolean;
  /** Identity Alignment 0–100. Null when not established. */
  alignment: number | null;
  horizons: IdentityAlignmentHorizons | null;
  trend: IdentityAlignmentTrend | null;
  /** Identity-centred message for the instrument panel. */
  message: string;
};

export const RECENT_ALIGNMENT_DAYS = 30;
export const TREND_LOOKBACK_DAYS = 7;

export const ESTABLISHING_MESSAGE =
  "Begin living your Standard. Alignment will establish with consistent action.";
