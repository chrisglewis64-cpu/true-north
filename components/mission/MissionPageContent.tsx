"use client";

import Link from "next/link";
import { useTrueNorth } from "@/context/TrueNorthContext";
import {
  getActiveMission,
  getCompletedMissions,
  getUpcomingMissions,
} from "@/lib/mission-utils";
import { CurrentMissionCard } from "@/components/mission/CurrentMissionCard";
import { MissionListItem } from "@/components/mission/MissionListItem";
import { SectionLabel } from "@/components/ui/SectionCard";
import { BottomNav } from "@/components/navigation/BottomNav";

export function MissionPageContent() {
  const { missions } = useTrueNorth();
  const activeMission = getActiveMission(missions);
  const upcomingMissions = getUpcomingMissions(missions);
  const completedMissions = getCompletedMissions(missions);

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="mb-10">
          <SectionLabel>Mission</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Missions
          </h1>
        </header>

        <div className="space-y-10">
          <section className="space-y-4">
            {activeMission ? (
              <CurrentMissionCard mission={activeMission} showActions />
            ) : (
              <div className="rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
                <SectionLabel>Current Mission</SectionLabel>
                <p className="mt-3 text-[15px] text-muted">
                  No active mission. Begin your next season when ready.
                </p>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionLabel>Upcoming Missions</SectionLabel>
            {upcomingMissions.length > 0 ? (
              upcomingMissions.map((mission) => (
                <MissionListItem
                  key={mission.id}
                  mission={mission}
                  variant="upcoming"
                />
              ))
            ) : (
              <p className="text-[15px] text-muted">No upcoming missions.</p>
            )}
          </section>

          <section className="space-y-4">
            <SectionLabel>Completed Missions</SectionLabel>
            {completedMissions.length > 0 ? (
              completedMissions.map((mission) => (
                <MissionListItem
                  key={mission.id}
                  mission={mission}
                  variant="completed"
                />
              ))
            ) : (
              <p className="text-[15px] text-muted">No completed missions yet.</p>
            )}
          </section>
        </div>

        <Link
          href="/mission/new"
          className="mt-10 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:h-16"
        >
          Create Mission
        </Link>
      </main>
      <BottomNav />
    </>
  );
}
