import { EditMissionBuilder } from "@/components/mission/EditMissionBuilder";

export default async function EditMissionPage({
  params,
}: PageProps<"/mission/[id]/edit">) {
  const { id } = await params;

  return <EditMissionBuilder missionId={id} />;
}
