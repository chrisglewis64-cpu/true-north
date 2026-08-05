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
    todaysMissionIntent,
    dailyDebrief,
    updateDailyDebriefDraft,
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
    return (
      <div className="flex min-h-dvh flex-col">
        <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
          <StepMissionComplete
            todaysCommitment={todaysMissionIntent?.commitment ?? ""}
            tomorrowsOnePercent={debriefDraft.tomorrowOnePercent}
            courseCorrection={debriefDraft.courseCorrection}
            onCourseCorrection={(value) =>
              updateDailyDebriefDraft({ courseCorrection: value })
            }
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

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 sm:max-w-xl sm:px-8 lg:max-w-2xl">
        <StepMissionComplete
          todaysCommitment={todaysMissionIntent?.commitment ?? ""}
          tomorrowsOnePercent={todaysDebrief.tomorrowOnePercent}
          courseCorrection={todaysDebrief.courseCorrection}
          onCourseCorrection={() => {}}
          onReturnHome={() => router.push("/operations")}
        />
      </main>
    </div>
  );
}
