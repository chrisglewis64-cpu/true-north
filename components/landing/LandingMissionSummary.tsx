"use client";

import { SectionLabel } from "@/components/ui/SectionCard";
import { useMissions } from "@/hooks/useMissions";
import { mission as placeholderMission } from "@/lib/placeholder-data";

export function LandingMissionSummary() {
  const { activeMission } = useMissions();
  const summary =
    activeMission?.purpose.trim() || placeholderMission.statement;

  return (
    <div className="animate-fade-in [animation-delay:160ms]">
      <SectionLabel>Current Mission</SectionLabel>
      <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-lg">
        {summary}
      </p>
    </div>
  );
}
