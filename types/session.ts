/**
 * The current in-memory user session.
 * Will map to Supabase Auth when persistence is added.
 */
export interface UserSession {
  id: string;
  displayName: string;
  startedAt: string;
}
