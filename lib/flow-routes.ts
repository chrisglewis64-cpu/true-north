export type FlowStep = {
  path: string;
  title: string;
  nextPath: string;
  nextLabel: string;
};

export const flowSteps: FlowStep[] = [
  {
    path: "/",
    title: "Landing",
    nextPath: "/mission-intent",
    nextLabel: "Continue",
  },
  {
    path: "/mission-intent",
    title: "Mission Intent",
    nextPath: "/operations",
    nextLabel: "Begin Mission",
  },
  {
    path: "/operations",
    title: "Operations",
    nextPath: "/debrief",
    nextLabel: "Daily Debrief",
  },
  {
    path: "/debrief",
    title: "Daily Debrief",
    nextPath: "/mission-complete",
    nextLabel: "Complete Mission",
  },
  {
    path: "/mission-complete",
    title: "Mission Complete",
    nextPath: "/operations",
    nextLabel: "Return to Operations",
  },
];

export function getFlowStep(path: string): FlowStep | undefined {
  return flowSteps.find((step) => step.path === path);
}
