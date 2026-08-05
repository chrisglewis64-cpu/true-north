"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { MissionForm } from "@/components/mission/MissionForm";
import { SectionLabel } from "@/components/ui/SectionCard";
import type { MissionInput } from "@/types/mission";

type EditMissionPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditMissionPage({ params }: EditMissionPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { getMissionById, updateMission } = useTrueNorth();
  const mission = getMissionById(id);

  if (!mission || mission.status === "completed") {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center sm:max-w-xl">
        <p className="text-muted">Mission not found or cannot be edited.</p>
        <Link href="/mission" className="mt-4 inline-block text-accent">
          Return to Missions
        </Link>
      </main>
    );
  }

  const initialValues: MissionInput = {
    name: mission.name,
    purpose: mission.purpose,
    whyThisMatters: mission.whyThisMatters,
    successCriteria: mission.successCriteria,
    currentProgress: mission.currentProgress,
    nextMilestone: mission.nextMilestone,
    missionStatus: mission.missionStatus,
  };

  function handleUpdate(input: MissionInput) {
    if (input.missionStatus === "complete") {
      router.push(`/mission/${id}/complete`);
      return;
    }

    updateMission(id, input);
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
        <SectionLabel>Edit Mission</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {mission.name}
        </h1>
      </header>

      <MissionForm
        initialValues={initialValues}
        submitLabel="Save Mission"
        onSubmit={handleUpdate}
        showStatusSelector
        includeCompleteStatus
      />
    </main>
  );
}
