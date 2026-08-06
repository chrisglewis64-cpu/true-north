"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import { MyStandardCard } from "@/components/landing/MyStandardCard";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { POST_AUTH_REDIRECT } from "@/lib/auth/paths";

/**
 * Daily Morning Commitment — Personal Standards, Current Mission,
 * Today's Intent, and COMMIT. Required once per local calendar day.
 */
export function LandingPage() {
  const router = useRouter();
  const { currentMission, session, setTodaysMissionIntent } = useTrueNorth();
  const [intent, setIntent] = useState("");
  const [intentError, setIntentError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  async function handleCommit() {
    if (!intent.trim()) {
      setIntentError("Set today's intent before you commit.");
      return;
    }

    setIntentError(undefined);
    setSubmitting(true);

    try {
      await setTodaysMissionIntent({
        commitment: intent.trim(),
        source: "custom",
        createdAt: new Date().toISOString(),
      });
      router.replace(POST_AUTH_REDIRECT);
      router.refresh();
    } catch {
      setIntentError("Unable to save today's commitment. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-8 pt-12 sm:max-w-xl sm:px-8 sm:pt-16 lg:max-w-2xl lg:pt-20">
        <header className="animate-fade-in">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
            True North
          </p>
          <h1 className="mt-8 text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Who are you today?
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted sm:text-lg">
            Today is another opportunity to live your standard.
          </p>
        </header>

        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
          <MyStandardCard />

          <div className="animate-fade-in [animation-delay:160ms]">
            <SectionLabel>Current Mission</SectionLabel>
            {currentMission ? (
              <>
                <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-lg">
                  {currentMission.name}
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                  {currentMission.purpose}
                </p>
              </>
            ) : (
              <p className="text-[15px] leading-relaxed text-muted">
                No active mission yet.
              </p>
            )}
          </div>

          <label
            className="block animate-fade-in [animation-delay:200ms]"
            htmlFor="morning-intent"
          >
            <SectionLabel>Today&apos;s Intent</SectionLabel>
            <input
              id="morning-intent"
              value={intent}
              onChange={(event) => setIntent(event.target.value)}
              placeholder="One clear commitment for today."
              disabled={submitting}
              className={`mt-1 w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none disabled:opacity-50 ${fieldErrorClass(Boolean(intentError))}`}
            />
            <ValidationMessage message={intentError} />
          </label>
        </div>
      </main>

      <footer className="animate-fade-in px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 [animation-delay:240ms] sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <button
            type="button"
            disabled={submitting}
            onClick={() => void handleCommit()}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
          >
            {submitting ? "Committing…" : "Commit"}
          </button>

          {session.id !== "session-local" ? (
            <p className="mt-5 text-center text-[14px] text-muted">
              {session.displayName}
            </p>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
