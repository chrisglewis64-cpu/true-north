import { LandingGate } from "@/components/landing/LandingGate";
import { LandingPage } from "@/components/landing/LandingPage";

// Landing is a full page — not a FlowPage placeholder.
// Required content: docs/NON_NEGOTIABLES.md.txt
export default function Home() {
  return (
    <LandingGate>
      <LandingPage />
    </LandingGate>
  );
}
