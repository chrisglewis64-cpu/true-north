import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { mapAuthUserToSession } from "@/lib/database/mappers";
import type { UserSession } from "@/types/session";

type Client = SupabaseClient<Database>;

export async function fetchProfile(
  client: Client,
  userId: string
): Promise<{ display_name: string; created_at: string } | null> {
  const { data, error } = await client
    .from("profiles")
    .select("display_name, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertProfile(
  client: Client,
  userId: string,
  displayName: string
): Promise<void> {
  const { error } = await client.from("profiles").upsert({
    id: userId,
    display_name: displayName,
  });

  if (error) throw error;
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

  if (!profile) {
    await upsertProfile(client, user.id, displayName);
  }

  return mapAuthUserToSession(
    user.id,
    displayName,
    profile?.created_at ?? user.created_at ?? new Date().toISOString()
  );
}
