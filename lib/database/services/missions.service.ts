import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import {
  completeMissionById,
  fetchMissions,
  insertMission,
  updateMissionById,
} from "@/lib/database/missions.repository";
import { resolveUserSession } from "@/lib/database/profiles.repository";
import type { Mission, MissionInput } from "@/types/mission";
import type { UserSession } from "@/types/session";

type Client = SupabaseClient<Database>;

export type MissionsStartupResult = {
  session: UserSession;
  missions: Mission[];
};

/**
 * Mission persistence service — the single entry point for Mission CRUD.
 * Repositories handle SQL; this service handles domain operations.
 */
export const missionsService = {
  async loadForUser(client: Client, userId: string): Promise<Mission[]> {
    return fetchMissions(client, userId);
  },

  async loadOnStartup(client: Client): Promise<MissionsStartupResult | null> {
    const session = await resolveUserSession(client);
    if (!session) return null;

    const missions = await fetchMissions(client, session.id);
    return { session, missions };
  },

  async create(client: Client, userId: string, mission: Mission): Promise<Mission> {
    return insertMission(client, userId, mission);
  },

  async update(
    client: Client,
    userId: string,
    missionId: string,
    input: MissionInput
  ): Promise<void> {
    await updateMissionById(client, userId, missionId, input);
  },

  async complete(
    client: Client,
    userId: string,
    missionId: string,
    lessonsLearned: string
  ): Promise<void> {
    await completeMissionById(client, userId, missionId, lessonsLearned);
  },
};
