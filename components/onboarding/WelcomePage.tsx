"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { ONBOARDING_PATH, SIGN_IN_PATH } from "@/lib/auth/paths";
import {
  logOnboardingRedirect,
  resolveOnboardingStage,
} from "@/lib/onboarding/stages";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * First-launch welcome — shown once. Continue persists welcome_completed.
 */
export function WelcomePage() {
  const router = useRouter();
  const { session, markWelcomeComplete } = useTrueNorth();
  const [submitting, setSubmitting] = useState(false);
  const stage = resolveOnboardingStage(session.onboarding);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        logOnboardingRedirect({
          userId: "anonymous",
          stage,
          pathname: "/welcome",
          target: SIGN_IN_PATH,
          reason: "no auth user on welcome",
        });
        router.replace(SIGN_IN_PATH);
        return;
      }

      // Already past welcome — never re-show.
      if (stage !== "welcome") {
        const target = ONBOARDING_PATH;
        logOnboardingRedirect({
          userId: data.user.id,
          stage,
          pathname: "/welcome",
          target,
          reason: "welcome already completed; advance to onboarding",
        });
        router.replace(target);
      }
    });
  }, [router, stage]);

  async function handleContinue() {
    if (submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await markWelcomeComplete();
      logOnboardingRedirect({
        userId: session.id,
        stage: "standards",
        pathname: "/welcome",
        target: ONBOARDING_PATH,
        reason: "welcome Continue — persisted welcome_completed",
      });
      router.replace(ONBOARDING_PATH);
    } catch (error) {
      console.error("[onboarding] Failed to persist welcome:", error);
      setSubmitting(false);
    }
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
          disabled={submitting}
          onClick={() => void handleContinue()}
          className="animate-fade-in mt-14 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px] [animation-delay:160ms]"
        >
          {submitting ? "Continuing…" : "Continue"}
        </button>
      </main>
    </div>
  );
}
