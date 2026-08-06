"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ReviewBackLink } from "@/components/review/ReviewBackLink";
import { WeeklyReviewSummary } from "@/components/review/WeeklyReviewSummary";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { getWeekStart } from "@/lib/bearings/week";
import { buildWeeklySummary } from "@/lib/review/build-weekly-summary";

/**
 * Weekly Review — reflection on the week, closing with a calm summary.
 */
export function WeeklyReviewPage() {
  const router = useRouter();
  const { dailyDebriefHistory, myStandard, currentMission } = useTrueNorth();
  const [complete, setComplete] = useState(false);

  const summary = useMemo(
    () =>
      buildWeeklySummary(dailyDebriefHistory, myStandard, getWeekStart()),
    [dailyDebriefHistory, myStandard]
  );

  if (complete) {
    return (
      <div className="flex min-h-dvh flex-col">
        <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
          <WeeklyReviewSummary
            summary={summary}
            onReturn={() => router.push("/review")}
          />
        </main>
      </div>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <ReviewBackLink />

        <header className="mb-10 mt-6 animate-fade-in">
          <SectionLabel>Weekly Review</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Week of {summary.weekLabel}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Reflect on alignment. Then close the week with clarity.
          </p>
        </header>

        <div className="space-y-10">
          {currentMission ? (
            <section className="animate-fade-in border-t border-border pt-6">
              <SectionLabel>Mission</SectionLabel>
              <p className="mt-3 text-[17px] font-medium tracking-tight text-foreground">
                {currentMission.name}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {currentMission.purpose}
              </p>
            </section>
          ) : null}

          <section className="animate-fade-in border-t border-border pt-6 [animation-delay:60ms]">
            <SectionLabel>This Week</SectionLabel>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {summary.debriefDays === 0
                ? "No Daily Debriefs recorded this week yet."
                : `${summary.debriefDays} day${summary.debriefDays === 1 ? "" : "s"} of evidence and reflection.`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Standards honoured
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {summary.totalYes}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Moments of drift
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {summary.totalNo}
                </p>
              </div>
            </div>
          </section>

          {summary.honoured ? (
            <section className="animate-fade-in border-t border-border pt-6 [animation-delay:100ms]">
              <SectionLabel>Most lived</SectionLabel>
              <p className="mt-3 text-[17px] font-medium text-foreground">
                &ldquo;{summary.honoured.statement}&rdquo;
              </p>
            </section>
          ) : null}

          {summary.drifted ? (
            <section className="animate-fade-in border-t border-border pt-6 [animation-delay:140ms]">
              <SectionLabel>Needs attention</SectionLabel>
              <p className="mt-3 text-[17px] font-medium text-foreground">
                &ldquo;{summary.drifted.statement}&rdquo;
              </p>
            </section>
          ) : null}

          <p className="animate-fade-in text-[15px] leading-relaxed text-muted [animation-delay:180ms]">
            Am I becoming the person I committed to be?
          </p>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <button
            type="button"
            onClick={() => setComplete(true)}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:h-16"
          >
            Complete Weekly Review
          </button>
        </div>
      </footer>
    </>
  );
}
