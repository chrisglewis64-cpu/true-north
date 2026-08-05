"use client";

import { useApp } from "@/context/AppContext";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";

export function CurrentMission() {
  const { currentMission } = useApp();

  return (
    <SectionCard className="animate-fade-in border-border-subtle p-6 sm:p-8 [animation-delay:80ms]">
      <SectionLabel>Current Mission</SectionLabel>

      <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
        {currentMission.title}
      </h2>

      <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
        {currentMission.purpose}
      </p>

      <div className="mt-8 space-y-5 border-t border-border pt-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Progress
          </p>
          <p className="mt-1.5 text-[15px] text-foreground/90">
            {currentMission.progress}
          </p>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Next Action
          </p>
          <p className="mt-1.5 text-[15px] font-medium text-foreground">
            {currentMission.nextAction}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
