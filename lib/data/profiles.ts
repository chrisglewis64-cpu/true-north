import type { SupabaseClient } from "@supabase/supabase-js";
import { mapProfileRow } from "@/lib/data/mappers";
import type { Profile, ProfileRow } from "@/types/profile";

export async function fetchProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data as ProfileRow);
}

export async function updateProfileDisplayName(
  supabase: SupabaseClient,
  userId: string,
  displayName: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", userId)
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data as ProfileRow);
}

export async function completeOnboarding(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ onboarding_complete: true })
    .eq("id", userId)
    .select("*")
    .single();

  if (error || !data) {
    return null;
  }

  return mapProfileRow(data as ProfileRow);
}
