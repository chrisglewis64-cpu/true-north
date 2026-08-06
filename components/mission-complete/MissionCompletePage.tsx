"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { serializeDebrief } from "@/lib/debrief-form";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { StepMissionComplete } from "@/components/debrief/StepMissionComplete";

export function MissionCompletePage() {
  const router = useRouter();
  const {
    myStandard,
    dailyDebrief,
    setDailyDebriefSubmission,
    setTodaysOnePercent,
    setDailyDebriefDraft,
  } = useTrueNorth();

  const { submission: todaysDebrief, draft: debriefDraft } = dailyDebrief;

  useEffect(() => {
    if (!todaysDebrief && !debriefDraft) {
      router.replace("/debrief");
    }
  }, [todaysDebrief, debriefDraft, router]);

  if (debriefDraft?.step === 4) {
    const standardsHonoured = debriefDraft.standards.filter(
      (entry) => entry.answer === "yes"
    ).length;
    const evidenceCount = debriefDraft.standards.filter(
      (entry) => entry.answer === "yes" && entry.evidence.trim()
    ).length;

    return (
      <div className="flex min-h-dvh flex-col">
        <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
          <StepMissionComplete
            evidenceCount={evidenceCount}
            standardsHonoured={standardsHonoured}
            onReturnHome={() => {
              setDailyDebriefSubmission(
                serializeDebrief(debriefDraft, myStandard)
              );
              setTodaysOnePercent({
                improvement: debriefDraft.tomorrowOnePercent.trim(),
                setAt: new Date().toISOString(),
                source: "debrief",
              });
              setDailyDebriefDraft(null);
            }}
          />
        </main>
      </div>
    );
  }

  if (!todaysDebrief) {
    return null;
  }

  const standardsHonoured = todaysDebrief.standards.filter(
    (entry) => entry.answer === "yes"
  ).length;
  const evidenceCount = todaysDebrief.standards.filter(
    (entry) => entry.answer === "yes" && entry.evidence.trim()
  ).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
        <StepMissionComplete
          evidenceCount={evidenceCount}
          standardsHonoured={standardsHonoured}
          onReturnHome={() => router.push("/operations")}
        />
      </main>
    </div>
  );
}
