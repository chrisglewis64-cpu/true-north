import { MissionIntentPage } from "@/components/mission-intent/MissionIntentPage";
import { LandingGate } from "@/components/flow/LandingGate";

export default function MissionIntent() {
  return (
    <LandingGate>
      <MissionIntentPage />
    </LandingGate>
  );
}
