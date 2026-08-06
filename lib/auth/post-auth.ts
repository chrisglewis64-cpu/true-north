import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { isOnboardingComplete } from "@/lib/database/profiles.repository";
import { ONBOARDING_PATH, POST_AUTH_REDIRECT } from "@/lib/auth/paths";

type Client = SupabaseClient<Database>;

/**
 * Resolves where to send a user after authentication.
 * Incomplete onboarding → onboarding. Otherwise → dashboard.
 */
export async function resolvePostAuthPath(
  client: Client,
  userId: string
): Promise<string> {
  const complete = await isOnboardingComplete(client, userId);
  return complete ? POST_AUTH_REDIRECT : ONBOARDING_PATH;
}
