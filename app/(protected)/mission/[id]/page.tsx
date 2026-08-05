import { CompletedMissionDetail } from "@/components/mission/CompletedMissionDetail";

export default async function MissionDetailPage({
  params,
}: PageProps<"/mission/[id]">) {
  const { id } = await params;

  return <CompletedMissionDetail missionId={id} />;
}
