"use client";

import { DebriefCompleteStep } from "@/components/debrief/DebriefCompleteStep";
import { useApp } from "@/context/AppContext";

export function MissionCompletePage() {
  const { todaysCommitment, todaysDebrief } = useApp();
  const tomorrowsOnePercent = todaysDebrief?.tomorrowOnePercent ?? "";

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
        <DebriefCompleteStep
          todaysCommitment={todaysCommitment}
          tomorrowsOnePercent={tomorrowsOnePercent}
        />
      </main>
    </div>
  );
}
