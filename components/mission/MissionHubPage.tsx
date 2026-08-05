"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CurrentMission } from "@/components/dashboard/CurrentMission";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useMissions } from "@/hooks/useMissions";
import { BottomNav } from "@/components/navigation/BottomNav";

export function MissionHubPage() {
  const router = useRouter();
  const {
    activeMission,
    upcomingMissions,
    completedMissions,
    deleteMission,
    reorderUpcomingMission,
    startMission,
  } = useMissions();

  function handleStartMission(id: string) {
    if (activeMission && activeMission.id !== id) {
      router.push(`/mission/${activeMission.id}/complete?next=${id}`);
      return;
    }

    startMission(id);
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <SectionLabel>Mission</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Mission System
          </h1>
        </header>

        <div className="mt-10 space-y-12">
          <div>
            <CurrentMission mission={activeMission} />
            {activeMission ? (
              <div className="mt-4">
                <Link
                  href={`/mission/${activeMission.id}/complete`}
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
                >
                  Complete current mission →
                </Link>
              </div>
            ) : null}
          </div>

          <section className="animate-fade-in [animation-delay:80ms]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <SectionLabel>Upcoming Missions</SectionLabel>
              <Link
                href="/mission/new"
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent transition-colors hover:text-foreground"
              >
                + Create
              </Link>
            </div>

            {upcomingMissions.length === 0 ? (
              <p className="text-[15px] leading-relaxed text-muted">
                No upcoming missions queued.
              </p>
            ) : (
              <ul className="space-y-3">
                {upcomingMissions.map((mission, index) => (
                  <li
                    key={mission.id}
                    className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-medium tracking-tight text-foreground/95">
                          {mission.name}
                        </h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-muted">
                          {mission.nextMilestone}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col gap-1">
                        <button
                          type="button"
                          aria-label={`Move ${mission.name} up`}
                          disabled={index === 0}
                          onClick={() =>
                            reorderUpcomingMission(mission.id, "up")
                          }
                          className="rounded-lg border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border-subtle disabled:opacity-30"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${mission.name} down`}
                          disabled={index === upcomingMissions.length - 1}
                          onClick={() =>
                            reorderUpcomingMission(mission.id, "down")
                          }
                          className="rounded-lg border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border-subtle disabled:opacity-30"
                        >
                          Down
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartMission(mission.id)}
                        className="rounded-xl bg-accent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white"
                      >
                        Start Mission
                      </button>
                      <Link
                        href={`/mission/${mission.id}/edit`}
                        className="rounded-xl border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border-subtle hover:text-foreground"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteMission(mission.id)}
                        className="rounded-xl border border-border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:border-border-subtle hover:text-foreground"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="animate-fade-in [animation-delay:160ms]">
            <SectionLabel>Completed Missions</SectionLabel>
            {completedMissions.length === 0 ? (
              <p className="text-[15px] leading-relaxed text-muted">
                Completed missions and their reviews will appear here.
              </p>
            ) : (
              <ul className="space-y-3">
                {completedMissions.map((mission) => (
                  <li key={mission.id}>
                    <Link
                      href={`/mission/${mission.id}`}
                      className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-subtle sm:px-6"
                    >
                      <div className="min-w-0 pr-4">
                        <span className="block text-[15px] font-medium text-foreground/90">
                          {mission.name}
                        </span>
                        {mission.completedAt ? (
                          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                            {new Intl.DateTimeFormat("en-NZ", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }).format(new Date(mission.completedAt))}
                          </span>
                        ) : null}
                      </div>
                      <span aria-hidden className="shrink-0 text-muted">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
