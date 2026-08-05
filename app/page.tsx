import { LandingPage } from "@/components/landing/LandingPage";
import { LandingGate } from "@/components/flow/LandingGate";

export default function Landing() {
  return (
    <LandingGate>
      <LandingPage />
    </LandingGate>
  );
}
