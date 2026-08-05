import { MissionCompletePage } from "@/components/mission-complete/MissionCompletePage";
import { MorningFlowGuard } from "@/components/flow/MorningFlowGuard";

export default function MissionComplete() {
  return (
    <MorningFlowGuard>
      <MissionCompletePage />
    </MorningFlowGuard>
  );
}
