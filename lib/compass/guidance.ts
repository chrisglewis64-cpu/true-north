import type { CompassHeading } from "@/types/compass";

const GUIDANCE: Record<CompassHeading, string[]> = {
  "true-north": [
    "Your daily rhythms are aligned — hold the line.",
    "Intent, mission, debrief, and review are in place.",
    "Stay the course; consistency is your edge today.",
  ],
  drifting: [
    "You are close — tighten one loose thread before it frays.",
    "Most signals are strong; one habit needs attention.",
    "A small correction now prevents drift tomorrow.",
  ],
  "off-course": [
    "Several anchors are missing — re-establish your morning intent.",
    "Return to your standard before the day runs you.",
    "Pause, recommit, and take the next right action.",
  ],
  lost: [
    "Start with Mission Intent — rebuild direction one step at a time.",
    "The compass resets when you return to your standard.",
    "Today is recoverable. Begin with one commitment.",
  ],
};

export function getCompassGuidance(heading: CompassHeading, date = new Date()): string {
  const options = GUIDANCE[heading];
  const dayIndex = Math.floor(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(2024, 0, 1)) /
      86_400_000
  );

  return options[dayIndex % options.length];
}
