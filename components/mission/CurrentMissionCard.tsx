"use client";

import Link from "next/link";
import type { Mission } from "@/types/mission";
import { resolveMissionProgressStatus } from "@/lib/mission-status";
import { MissionStatusBadge } from "@/components/mission/MissionStatusBadge";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";

type CurrentMissionCardProps = {
  mission: Mission;
  showActions?: boolean;
};

export function CurrentMissionCard({
  mission,
  showActions = false,
}: CurrentMissionCardProps) {
  const progressStatus = resolveMissionProgressStatus(mission);

  return (
    <SectionCard className="border-border-subtle p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <SectionLabel>Current Mission</SectionLabel>
        <MissionStatusBadge status={progressStatus} />
      </div>

      <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-[1.75rem]">
        {mission.name}
      </h2>

      <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">
        {mission.purpose}
      </p>

      <div className="mt-8 space-y-5 border-t border-border pt-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Current Progress
          </p>
          <p className="mt-1.5 text-[15px] text-foreground/90">
            {mission.currentProgress}
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

      {showActions && (
        <div className="mt-8 flex gap-3">
          <Link
            href={`/mission/${mission.id}/edit`}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-surface text-sm font-medium text-foreground transition-colors hover:border-border-subtle"
          >
            Edit
          </Link>
          <Link
            href={`/mission/${mission.id}/complete`}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-surface text-sm font-medium text-foreground transition-colors hover:border-border-subtle"
          >
            Complete
          </Link>
        </div>
      )}

      {!showActions && (
        <Link
          href="/mission"
          className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          View Mission →
        </Link>
      )}
    </SectionCard>
  );
}
