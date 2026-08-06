import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { fetchDailyDebriefForDate, fetchRecentDailyDebriefs } from "@/lib/database/daily-debriefs.repository";
import { fetchDailyOnePercentForDate } from "@/lib/database/daily-one-percent.repository";
import {
  fetchMissionIntentForDate,
  fetchRecentMissionIntents,
} from "@/lib/database/mission-intents.repository";
import { fetchMissions } from "@/lib/database/missions.repository";
import { resolveUserSession } from "@/lib/database/profiles.repository";
import { fetchStandards } from "@/lib/database/standards.repository";
import { getLocalDateString } from "@/lib/database/utils";
import { createInitialTrueNorthState } from "@/lib/true-north-defaults";
import type { TrueNorthState } from "@/types/true-north";

type Client = SupabaseClient<Database>;

/**
 * Loads persisted True North state for the authenticated user.
 * Falls back to defaults for any missing daily records.
 * Standards are never auto-seeded — users create them in onboarding.
 */
export async function loadTrueNorthState(
  client: Client
): Promise<TrueNorthState | null> {
  const session = await resolveUserSession(client);
  if (!session) return null;

  const today = getLocalDateString();
  const defaults = createInitialTrueNorthState();

  const [myStandard, missions, todaysMissionIntent, todaysOnePercent, debriefSubmission, dailyDebriefHistory, missionIntentHistory] =
    await Promise.all([
      fetchStandards(client, session.id),
      fetchMissions(client, session.id),
      fetchMissionIntentForDate(client, session.id, today),
      fetchDailyOnePercentForDate(client, session.id, today),
      fetchDailyDebriefForDate(client, session.id, today),
      fetchRecentDailyDebriefs(client, session.id),
      fetchRecentMissionIntents(client, session.id),
    ]);

  return {
    myStandard,
    todaysMissionIntent,
    todaysOnePercent: todaysOnePercent ?? defaults.todaysOnePercent,
    dailyDebrief: {
      submission: debriefSubmission,
      draft: null,
    },
    dailyDebriefHistory,
    missionIntentHistory,
    weeklyReviews: [],
    session,
    missions,
  };
}
