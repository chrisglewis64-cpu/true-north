"use client";

import Link from "next/link";
import { use } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { CompleteMissionForm } from "@/components/mission/CompleteMissionForm";

type CompleteMissionPageProps = {
  params: Promise<{ id: string }>;
};

export default function CompleteMissionPage({ params }: CompleteMissionPageProps) {
  const { id } = use(params);
  const { getMissionById } = useTrueNorth();
  const mission = getMissionById(id);

  if (!mission || mission.status !== "active") {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center sm:max-w-xl">
        <p className="text-muted">Only an active mission can be completed.</p>
        <Link href="/mission" className="mt-4 inline-block text-accent">
          Return to Missions
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-12 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
      <CompleteMissionForm missionId={mission.id} missionName={mission.name} />
    </main>
  );
}
