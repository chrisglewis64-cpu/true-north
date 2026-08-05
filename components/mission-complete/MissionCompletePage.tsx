"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { SectionLabel } from "@/components/ui/SectionCard";

export function MissionCompletePage() {
  const { todaysCommitment, todaysDebrief } = useApp();

  const tomorrowsOnePercent = todaysDebrief?.tomorrowOnePercent ?? "";

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
        <header className="text-center">
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

        <div className="mt-16 space-y-10">
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
      </main>

      <footer className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <Link
            href="/operations"
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16 sm:text-[15px]"
          >
            Return Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
