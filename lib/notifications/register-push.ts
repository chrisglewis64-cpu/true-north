import { upsertPushSubscription } from "@/lib/database/push-subscriptions.repository";
import { subscribeToPushNotifications } from "@/lib/pwa/push-notifications";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Ensures the browser has a push subscription and persists it for the user.
 */
export async function registerBrowserPushSubscription(
  userId: string
): Promise<boolean> {
  if (!isSupabaseConfigured() || userId === "session-local") {
    return false;
  }

  const subscription = await subscribeToPushNotifications();
  if (!subscription) {
    return false;
  }

  try {
    const supabase = createSupabaseBrowserClient();
    await upsertPushSubscription(supabase, userId, subscription);
    return true;
  } catch (error) {
    console.error("[Push] Failed to save subscription:", error);
    return false;
  }
}
