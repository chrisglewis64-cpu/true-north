"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import { useMissions } from "@/hooks/useMissions";

type CompleteMissionPageProps = {
  missionId: string;
  nextMissionId?: string;
};

export function CompleteMissionPageContent({
  missionId,
  nextMissionId,
}: CompleteMissionPageProps) {
  const router = useRouter();
  const { getMissionById, completeMission, startMission } = useMissions();
  const mission = getMissionById(missionId);
  const [missionReview, setMissionReview] = useState("");
  const [error, setError] = useState<string>();
  const [summary, setSummary] = useState<string>();

  if (!mission || mission.lifecycleStatus !== "active") {
    return (
      <main className="mx-auto w-full max-w-lg px-6 py-16 text-center sm:max-w-xl">
        <p className="text-muted">Active mission not found.</p>
      </main>
    );
  }

  function handleComplete() {
    if (!missionReview.trim()) {
      setError("Mission review is required before completing this mission.");
      setSummary("Capture what you learned before closing this mission.");
      return;
    }

    completeMission(missionId, missionReview.trim());

    if (nextMissionId) {
      startMission(nextMissionId);
    }

    router.push("/mission");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <Link
            href="/mission"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            ← Mission
          </Link>
          <SectionLabel>Complete Mission</SectionLabel>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {mission.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Record a mission review before this mission moves to completed.
          </p>
        </header>

        <section className="mt-10 animate-fade-in [animation-delay:80ms]">
          <label className="block" htmlFor="mission-review">
            <SectionLabel>Mission Review</SectionLabel>
            <textarea
              id="mission-review"
              value={missionReview}
              onChange={(event) => {
                setMissionReview(event.target.value);
                if (error) {
                  setError(undefined);
                  setSummary(undefined);
                }
              }}
              rows={8}
              placeholder="What did this mission produce? What would you carry forward?"
              aria-invalid={Boolean(error)}
              className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(error))}`}
            />
            <ValidationMessage message={error} />
          </label>
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <ValidationSummary message={summary} />
          <button
            type="button"
            onClick={handleComplete}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16"
          >
            {nextMissionId ? "Complete & Start Next" : "Complete Mission"}
          </button>
        </div>
      </footer>
    </div>
  );
}
