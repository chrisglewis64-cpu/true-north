"use client";

import { useTrueNorth } from "@/context/TrueNorthContext";
import { CurrentMissionCard } from "@/components/mission/CurrentMissionCard";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import Link from "next/link";

export function CurrentMission() {
  const { currentMission } = useTrueNorth();

  if (!currentMission) {
    return (
      <SectionCard className="border-border-subtle p-6 sm:p-8">
        <SectionLabel>Current Mission</SectionLabel>
        <p className="mt-3 text-[15px] text-muted">
          No active mission.
        </p>
        <Link
          href="/mission/new"
          className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-accent"
        >
          Create Mission →
        </Link>
      </SectionCard>
    );
  }

  return <CurrentMissionCard mission={currentMission} />;
}
