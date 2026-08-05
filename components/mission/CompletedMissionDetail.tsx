"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useMissions } from "@/hooks/useMissions";
import { BottomNav } from "@/components/navigation/BottomNav";

type CompletedMissionDetailProps = {
  missionId: string;
};

export function CompletedMissionDetail({
  missionId,
}: CompletedMissionDetailProps) {
  const { getMissionById } = useMissions();
  const mission = getMissionById(missionId);

  if (!mission || mission.lifecycleStatus !== "completed") {
    return (
      <>
        <main className="mx-auto w-full max-w-lg px-6 py-16 text-center sm:max-w-xl">
          <p className="text-muted">Completed mission not found.</p>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <Link
            href="/mission"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            ← Mission
          </Link>
          <SectionLabel>Completed Mission</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {mission.name}
          </h1>
        </header>

        <div className="mt-10 space-y-8 animate-fade-in [animation-delay:80ms]">
          <section>
            <SectionLabel>Purpose</SectionLabel>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {mission.purpose}
            </p>
          </section>

          <section>
            <SectionLabel>Success Criteria</SectionLabel>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {mission.successCriteria}
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <SectionLabel>Mission Review</SectionLabel>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {mission.missionReview?.trim() || "No mission review recorded."}
            </p>
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
