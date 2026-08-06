import { redirect } from "next/navigation";
import { LandingGate } from "@/components/landing/LandingGate";
import { LandingPage } from "@/components/landing/LandingPage";
import { POST_AUTH_REDIRECT, SIGN_IN_PATH } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Application root.
 * Authenticated → dashboard. Unauthenticated → Sign In.
 * Local/demo mode (Supabase unset) keeps the identity landing.
 */
export default async function Home() {
  if (!isSupabaseConfigured()) {
    return (
      <LandingGate>
        <LandingPage />
      </LandingGate>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? POST_AUTH_REDIRECT : SIGN_IN_PATH);
}
