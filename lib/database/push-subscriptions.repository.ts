import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import type { PushSubscriptionPayload } from "@/lib/pwa/push-notifications";

type Client = SupabaseClient<Database>;

/**
 * Upserts a browser push subscription for the authenticated user.
 * Reuses the unique (user_id, endpoint) constraint for existing devices.
 */
export async function upsertPushSubscription(
  client: Client,
  userId: string,
  subscription: PushSubscriptionPayload
): Promise<void> {
  if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
    throw new Error("Push subscription is missing encryption keys.");
  }

  const now = new Date().toISOString();
  const { error } = await client.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      updated_at: now,
    },
    { onConflict: "user_id,endpoint" }
  );

  if (error) throw error;
}
