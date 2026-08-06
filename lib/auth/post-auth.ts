import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { fetchMissionIntentForDate } from "@/lib/database/mission-intents.repository";
import { fetchProfile } from "@/lib/database/profiles.repository";
import { mapOnboardingProgress } from "@/lib/database/mappers";
import { getLocalDateString } from "@/lib/database/utils";
import {
  MORNING_COMMIT_PATH,
  POST_AUTH_REDIRECT,
} from "@/lib/auth/paths";
import {
  EMPTY_ONBOARDING_PROGRESS,
  pathForOnboardingStage,
  resolveOnboardingStage,
} from "@/lib/onboarding/stages";

type Client = SupabaseClient<Database>;

/**
 * Resolves where to send a user after authentication using the
 * profile-persisted onboarding stage machine.
 */
export async function resolvePostAuthPath(
  client: Client,
  userId: string
): Promise<string> {
  const profile = await fetchProfile(client, userId);
  const progress = profile
    ? mapOnboardingProgress(profile)
    : EMPTY_ONBOARDING_PROGRESS;
  const stage = resolveOnboardingStage(progress);

  console.log("[onboarding-post-auth]", {
    user: userId,
    stage,
    progress,
  });

  if (stage !== "complete") {
    return pathForOnboardingStage(stage);
  }

  const today = getLocalDateString();
  const todaysIntent = await fetchMissionIntentForDate(client, userId, today);
  return todaysIntent ? POST_AUTH_REDIRECT : MORNING_COMMIT_PATH;
}
