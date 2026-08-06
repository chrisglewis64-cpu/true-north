import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/database/database.types";
import {
  mapAuthUserToSession,
  mapOnboardingProgress,
} from "@/lib/database/mappers";
import { EMPTY_ONBOARDING_PROGRESS } from "@/lib/onboarding/stages";
import { mergeNotificationSettings } from "@/lib/notifications/storage";
import type { NotificationSettings } from "@/types/notifications";
import type { UserSession } from "@/types/session";

type Client = SupabaseClient<Database>;

export type ProfileRow = {
  display_name: string;
  email: string | null;
  created_at: string;
  onboarding_completed_at: string | null;
  welcome_completed_at: string | null;
  standards_completed_at: string | null;
  mission_completed_at: string | null;
};

export async function fetchProfile(
  client: Client,
  userId: string
): Promise<ProfileRow | null> {
  const { data, error } = await client
    .from("profiles")
    .select(
      "display_name, email, created_at, onboarding_completed_at, welcome_completed_at, standards_completed_at, mission_completed_at"
    )
    .eq("id", userId)
    .maybeSingle();

  // Migration 010 may not be applied yet — fall back without stage columns.
  if (error) {
    const fallback = await client
      .from("profiles")
      .select("display_name, email, created_at, onboarding_completed_at")
      .eq("id", userId)
      .maybeSingle();

    if (fallback.error) throw fallback.error;
    if (!fallback.data) return null;

    console.warn(
      "[onboarding] Stage columns missing — run migration 010_onboarding_stages.sql"
    );

    return {
      ...fallback.data,
      welcome_completed_at: fallback.data.onboarding_completed_at,
      standards_completed_at: fallback.data.onboarding_completed_at,
      mission_completed_at: fallback.data.onboarding_completed_at,
    };
  }

  return data;
}

export async function fetchNotificationPreferences(
  client: Client,
  userId: string
): Promise<NotificationSettings> {
  const { data, error } = await client
    .from("profiles")
    .select("notification_preferences")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return mergeNotificationSettings(data?.notification_preferences ?? {});
}

export async function saveNotificationPreferences(
  client: Client,
  userId: string,
  settings: NotificationSettings
): Promise<void> {
  const { error } = await client
    .from("profiles")
    .update({
      notification_preferences: settings as unknown as Json,
    })
    .eq("id", userId);

  if (error) throw error;
}

export async function upsertProfile(
  client: Client,
  userId: string,
  displayName: string,
  email?: string | null
): Promise<void> {
  const { error } = await client.from("profiles").upsert({
    id: userId,
    display_name: displayName,
    ...(email ? { email } : {}),
  });

  if (error) throw error;
}

export async function markWelcomeComplete(
  client: Client,
  userId: string,
  completedAt = new Date().toISOString()
): Promise<void> {
  const { error } = await client
    .from("profiles")
    .update({ welcome_completed_at: completedAt })
    .eq("id", userId);

  if (error) throw error;
}

export async function markStandardsComplete(
  client: Client,
  userId: string,
  completedAt = new Date().toISOString()
): Promise<void> {
  const { error } = await client
    .from("profiles")
    .update({ standards_completed_at: completedAt })
    .eq("id", userId);

  if (error) throw error;
}

export async function markMissionStageComplete(
  client: Client,
  userId: string,
  completedAt = new Date().toISOString()
): Promise<void> {
  const { error } = await client
    .from("profiles")
    .update({ mission_completed_at: completedAt })
    .eq("id", userId);

  if (error) throw error;
}

export async function markOnboardingComplete(
  client: Client,
  userId: string,
  completedAt = new Date().toISOString()
): Promise<void> {
  const { error } = await client
    .from("profiles")
    .update({
      welcome_completed_at: completedAt,
      standards_completed_at: completedAt,
      mission_completed_at: completedAt,
      onboarding_completed_at: completedAt,
    })
    .eq("id", userId);

  if (error) throw error;
}

export async function isOnboardingComplete(
  client: Client,
  userId: string
): Promise<boolean> {
  const profile = await fetchProfile(client, userId);
  return Boolean(profile?.onboarding_completed_at);
}

export async function resolveUserSession(client: Client): Promise<UserSession | null> {
  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error || !user) return null;

  const profile = await fetchProfile(client, user.id);
  const displayName =
    profile?.display_name ??
    user.user_metadata?.display_name ??
    user.email?.split("@")[0] ??
    "Operator";
  const email = profile?.email ?? user.email ?? null;

  if (!profile) {
    await upsertProfile(client, user.id, displayName, user.email);
  }

  const onboarding = profile
    ? mapOnboardingProgress(profile)
    : { ...EMPTY_ONBOARDING_PROGRESS };

  return mapAuthUserToSession(
    user.id,
    displayName,
    profile?.created_at ?? user.created_at ?? new Date().toISOString(),
    onboarding,
    email
  );
}
