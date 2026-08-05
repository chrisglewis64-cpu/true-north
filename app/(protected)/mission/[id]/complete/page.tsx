import { CompleteMissionPageContent } from "@/components/mission/CompleteMissionPageContent";

export default async function CompleteMissionPage({
  params,
  searchParams,
}: PageProps<"/mission/[id]/complete">) {
  const { id } = await params;
  const query = await searchParams;
  const nextMissionId =
    typeof query.next === "string" ? query.next : undefined;

  return (
    <CompleteMissionPageContent
      missionId={id}
      nextMissionId={nextMissionId}
    />
  );
}
