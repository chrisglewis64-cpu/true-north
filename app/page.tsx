import { FlowPage } from "@/components/flow/FlowPage";
import { getFlowStep } from "@/lib/flow-routes";

export default function Landing() {
  const step = getFlowStep("/");

  if (!step) {
    return null;
  }

  return (
    <FlowPage
      title={step.title}
      nextPath={step.nextPath}
      nextLabel={step.nextLabel}
    />
  );
}
