"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { hasActiveMission } from "@/lib/mission-utils";
import { MissionForm } from "@/components/mission/MissionForm";
import { SectionLabel } from "@/components/ui/SectionCard";
import type { MissionInput } from "@/types/mission";

export default function NewMissionPage() {
  const router = useRouter();
  const { missions, createMission } = useTrueNorth();
  const willBeUpcoming = hasActiveMission(missions);

  async function handleCreate(input: MissionInput) {
    await createMission(input);
    router.push("/mission");
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-12 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
      <Link
        href="/mission"
        className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
      >
        ← Back
      </Link>

      <header className="mb-10 mt-6">
        <SectionLabel>New Mission</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Create Mission
        </h1>
        {willBeUpcoming && (
          <p className="mt-3 text-[15px] text-muted">
            You already have an active mission. This will be added to Upcoming
            Missions.
          </p>
        )}
        {!willBeUpcoming && (
          <p className="mt-3 text-[15px] text-muted">
            This will become your Current Mission.
          </p>
        )}
      </header>

      <MissionForm
        submitLabel="Create Mission"
        onSubmit={handleCreate}
        showStatusSelector
      />
    </main>
  );
}
