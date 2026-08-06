import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { fetchMissionIntentForDate } from "@/lib/database/mission-intents.repository";
import { isOnboardingComplete } from "@/lib/database/profiles.repository";
import { getLocalDateString } from "@/lib/database/utils";
import {
  MORNING_COMMIT_PATH,
  ONBOARDING_PATH,
  POST_AUTH_REDIRECT,
} from "@/lib/auth/paths";

type Client = SupabaseClient<Database>;

/**
 * Resolves where to send a user after authentication.
 * Incomplete onboarding → onboarding.
 * Missing today's commitment → Morning Commitment.
 * Otherwise → dashboard.
 */
export async function resolvePostAuthPath(
  client: Client,
  userId: string
): Promise<string> {
  const onboarded = await isOnboardingComplete(client, userId);
  if (!onboarded) {
    return ONBOARDING_PATH;
  }

  const today = getLocalDateString();
  const todaysIntent = await fetchMissionIntentForDate(client, userId, today);
  return todaysIntent ? POST_AUTH_REDIRECT : MORNING_COMMIT_PATH;
}
