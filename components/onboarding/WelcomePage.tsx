"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { ONBOARDING_PATH, SIGN_IN_PATH } from "@/lib/auth/paths";
import { hasSeenWelcome, markWelcomeSeen } from "@/lib/storage/welcome";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * First-launch welcome — shown once before onboarding.
 */
export function WelcomePage() {
  const router = useRouter();
  const { session, hasCompletedOnboarding } = useTrueNorth();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(SIGN_IN_PATH);
        return;
      }

      if (hasCompletedOnboarding) {
        router.replace("/operations");
        return;
      }

      if (hasSeenWelcome(data.user.id)) {
        router.replace(ONBOARDING_PATH);
      }
    });
  }, [hasCompletedOnboarding, router]);

  function handleContinue() {
    const userId = session.id !== "session-local" ? session.id : "session-local";
    markWelcomeSeen(userId);
    router.replace(ONBOARDING_PATH);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
        <p className="animate-fade-in font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
          Welcome
        </p>

        <div className="animate-fade-in mt-12 space-y-6 text-[17px] leading-relaxed text-foreground/90 sm:text-lg [animation-delay:80ms]">
          <p>True North is not a productivity app.</p>
          <p>It is a personal operating system.</p>
          <p>
            It exists to help close the gap between who you are today and who
            you intend to become.
          </p>
          <p>Every action is a vote for your future identity.</p>
          <p className="pt-2 font-medium text-foreground">Let&apos;s begin.</p>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="animate-fade-in mt-14 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px] [animation-delay:160ms]"
        >
          Continue
        </button>
      </main>
    </div>
  );
}
