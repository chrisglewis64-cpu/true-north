"use client";

import { MissionBuilder, createEmptyMissionDraft } from "@/components/mission/MissionBuilder";
import { useMissions } from "@/hooks/useMissions";

export function CreateMissionBuilder() {
  const { createMission } = useMissions();

  return (
    <MissionBuilder
      mode="create"
      initialDraft={createEmptyMissionDraft()}
      onSave={createMission}
    />
  );
}
