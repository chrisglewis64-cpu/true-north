"use client";

import { MissionBuilder, missionToDraft } from "@/components/mission/MissionBuilder";
import { useMissions } from "@/hooks/useMissions";

type EditMissionBuilderProps = {
  missionId: string;
};

export function EditMissionBuilder({ missionId }: EditMissionBuilderProps) {
  const { getMissionById, updateMission } = useMissions();
  const mission = getMissionById(missionId);

  if (!mission || mission.lifecycleStatus === "completed") {
    return (
      <main className="mx-auto w-full max-w-lg px-6 py-16 text-center sm:max-w-xl">
        <p className="text-muted">Mission not found.</p>
      </main>
    );
  }

  return (
    <MissionBuilder
      mode="edit"
      initialDraft={missionToDraft(mission)}
      onSave={(draft) => updateMission(missionId, draft)}
    />
  );
}
