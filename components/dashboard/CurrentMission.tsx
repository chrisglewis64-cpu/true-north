"use client";

import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import type { Mission } from "@/types/mission";

type CurrentMissionProps = {
  mission?: Mission;
};

export function CurrentMission({ mission }: CurrentMissionProps) {
  if (!mission) {
    return (
      <SectionCard className="animate-fade-in border-border-subtle p-6 sm:p-8 [animation-delay:80ms]">
        <SectionLabel>Current Mission</SectionLabel>
        <p className="text-[15px] leading-relaxed text-muted">
          No active mission. Start one from the Mission tab.
        </p>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="animate-fade-in border-border-subtle p-6 sm:p-8 [animation-delay:80ms]">
      <SectionLabel>Current Mission</SectionLabel>

      <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
        {mission.name}
      </h2>

      <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
        {mission.purpose}
      </p>

      <div className="mt-8 space-y-5 border-t border-border pt-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Success Criteria
          </p>
          <p className="mt-1.5 text-[15px] text-foreground/90">
            {mission.successCriteria}
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Mission Status
          </p>
          <p className="mt-1.5 text-[15px] text-foreground/90">
            {mission.missionStatus}
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Next Milestone
          </p>
          <p className="mt-1.5 text-[15px] font-medium text-foreground">
            {mission.nextMilestone}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
