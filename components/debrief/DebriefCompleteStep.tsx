"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";

type DebriefCompleteStepProps = {
  todaysCommitment: string;
  tomorrowsOnePercent: string;
};

export function DebriefCompleteStep({
  todaysCommitment,
  tomorrowsOnePercent,
}: DebriefCompleteStepProps) {
  return (
    <>
      <header className="text-center animate-fade-in">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          True North
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Mission Complete
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted sm:text-lg">
          You produced evidence today.
        </p>
      </header>

      <div className="mt-16 space-y-10 animate-fade-in [animation-delay:80ms]">
        <section>
          <SectionLabel>Today&apos;s Commitment</SectionLabel>
          <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
            {todaysCommitment.trim() || "—"}
          </p>
        </section>

        <section>
          <SectionLabel>Tomorrow&apos;s 1%</SectionLabel>
          <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
            {tomorrowsOnePercent.trim() || "—"}
          </p>
        </section>
      </div>

      <footer className="mt-16 animate-fade-in [animation-delay:160ms]">
        <Link
          href="/operations"
          className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16 sm:text-[15px]"
        >
          Return Home
        </Link>
      </footer>
    </>
  );
}
