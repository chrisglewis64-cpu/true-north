import { redirect } from "next/navigation";
import { LandingGate } from "@/components/landing/LandingGate";
import { LandingPage } from "@/components/landing/LandingPage";
import { SIGN_IN_PATH } from "@/lib/auth/paths";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Application root — Morning Commitment gate.
 * Unauthenticated → Sign In.
 * Authenticated → daily commitment (or dashboard via LandingGate if already done).
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

  if (!user) {
    redirect(SIGN_IN_PATH);
  }

  return (
    <LandingGate>
      <LandingPage />
    </LandingGate>
  );
}
