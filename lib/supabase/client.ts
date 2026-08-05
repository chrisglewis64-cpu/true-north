import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";
import type { Database } from "@/lib/database/database.types";

let browserClient: SupabaseClient<Database> | null = null;

/**
 * Browser Supabase client for client components and TrueNorthContext persistence.
 */
export function createSupabaseBrowserClient(): SupabaseClient<Database> {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey()
    );
  }

  return browserClient;
}
