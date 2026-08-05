"use client";

import Link from "next/link";
import type { Mission } from "@/types/mission";
import { formatMissionDate } from "@/lib/mission-data";
import { resolveMissionProgressStatus } from "@/lib/mission-status";
import { MissionStatusBadge } from "@/components/mission/MissionStatusBadge";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";

type MissionListItemProps = {
  mission: Mission;
  variant: "upcoming" | "completed";
};

export function MissionListItem({ mission, variant }: MissionListItemProps) {
  const href =
    variant === "upcoming" ? `/mission/${mission.id}/edit` : `/mission/${mission.id}`;

  return (
    <Link href={href}>
      <SectionCard className="p-5 transition-colors hover:border-border-subtle sm:p-6">
        <p className="text-[15px] font-medium leading-relaxed text-foreground/90 sm:text-base">
          {mission.name}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {mission.purpose}
        </p>
        {variant === "completed" && mission.completedAt && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Completed {formatMissionDate(mission.completedAt)}
          </p>
        )}
      </SectionCard>
    </Link>
  );
}

type MissionDetailProps = {
  mission: Mission;
};

export function MissionDetail({ mission }: MissionDetailProps) {
  const progressStatus = resolveMissionProgressStatus(mission);

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-start justify-between gap-4">
          <SectionLabel>
            {mission.status === "completed" ? "Completed Mission" : "Mission"}
          </SectionLabel>
          <MissionStatusBadge status={progressStatus} />
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {mission.name}
        </h1>
      </header>

      <DetailField label="Mission Purpose" value={mission.purpose} />
      {mission.whyThisMatters && (
        <DetailField label="Why This Matters" value={mission.whyThisMatters} />
      )}
      {mission.successCriteria && (
        <DetailField label="Success Criteria" value={mission.successCriteria} />
      )}
      <DetailField label="Current Progress" value={mission.currentProgress} />
      <DetailField label="Next Milestone" value={mission.nextMilestone} />
      {mission.status === "completed" && mission.lessonsLearned && (
        <DetailField label="Lessons Learned" value={mission.lessonsLearned} />
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <section>
      <SectionLabel>{label}</SectionLabel>
      <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
        {value}
      </p>
    </section>
  );
}
