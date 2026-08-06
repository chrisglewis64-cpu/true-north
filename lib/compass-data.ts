import type { CompassHeading, CompassState, AlignmentReport } from "@/types/compass";
import { getGuidanceFromAlignment } from "@/lib/compass/guidance";
import {
  getHeadingFromAlignment,
} from "@/lib/compass/alignment";

export type CompassHeadingOption = {
  value: CompassHeading;
  label: string;
  emoji: string;
  description: string;
};

export const COMPASS_HEADING_OPTIONS: CompassHeadingOption[] = [
  {
    value: "true_north",
    label: "On Course",
    emoji: "",
    description: "Living consistently according to My Standard.",
  },
  {
    value: "drifting",
    label: "Slightly Off Course",
    emoji: "",
    description: "Small inconsistencies have appeared.",
  },
  {
    value: "off_course",
    label: "Off Course",
    emoji: "",
    description:
      "My actions are no longer consistently matching My Standard.",
  },
  {
    value: "lost",
    label: "Off Course",
    emoji: "",
    description: "I have drifted significantly from My Standard.",
  },
];

export function getCompassHeadingOption(
  heading: CompassHeading
): CompassHeadingOption {
  return (
    COMPASS_HEADING_OPTIONS.find((option) => option.value === heading) ??
    COMPASS_HEADING_OPTIONS[0]
  );
}

export function getCompassNeedleClass(heading: CompassHeading): string {
  switch (heading) {
    case "true_north":
      return "text-accent";
    case "drifting":
      return "text-amber-400";
    case "off_course":
      return "text-orange-400";
    case "lost":
      return "text-red-400";
  }
}

export function getCompassRingClass(heading: CompassHeading): string {
  switch (heading) {
    case "true_north":
      return "text-accent/30";
    case "drifting":
      return "text-amber-500/25";
    case "off_course":
      return "text-orange-500/25";
    case "lost":
      return "text-red-500/25";
  }
}

export function getCompassHeadingTextClass(heading: CompassHeading): string {
  switch (heading) {
    case "true_north":
      return "text-accent";
    case "drifting":
      return "text-amber-400/90";
    case "off_course":
      return "text-orange-400/90";
    case "lost":
      return "text-red-400/90";
  }
}

/** Internal placeholder — change to preview other needle positions. Never displayed. */
export const compassAlignmentPlaceholder = 94;

export const compassStatePlaceholder: CompassState = {
  alignment: compassAlignmentPlaceholder,
  guidance: "Stay the course.",
};

export const alignmentReportPlaceholder: AlignmentReport = {
  alignment: compassAlignmentPlaceholder,
  strongestStandard: "I keep my word.",
  greatestOpportunity: "I walk with God.",
  currentDrift:
    "Morning presence has slipped on three of the last seven days. Small drift — correctable now.",
  suggestedCourseCorrection:
    "Choose discipline today. Phone stays off until prayer is done.",
  missionAlignment:
    "Build the True North MVP directly serves who I am becoming — disciplined builder, man of his word.",
  upcomingFocus:
    "Protect morning rhythm. Finish Compass v1 before adding new scope.",
};

export const compassPlaceholderByHeading: Record<
  CompassHeading,
  { guidance: string; report: Omit<AlignmentReport, "alignment"> }
> = {
  true_north: {
    guidance: "Stay the course.",
    report: {
      strongestStandard: "I keep my word.",
      greatestOpportunity: "I walk with God.",
      currentDrift: "Minimal drift. Living aligned with My Standard.",
      suggestedCourseCorrection: "Maintain rhythm. Protect the debrief.",
      missionAlignment:
        "Current mission supports My Standard. Building with discipline and finishing what I start.",
      upcomingFocus:
        "Hold the line. One percent today. Debrief tonight without skipping.",
    },
  },
  drifting: {
    guidance: "Correct before drift becomes distance.",
    report: {
      strongestStandard: "I pursue excellence in everything I do.",
      greatestOpportunity: "I choose discipline over comfort.",
      currentDrift:
        "Small inconsistencies in morning routine and evening debrief timing.",
      suggestedCourseCorrection:
        "Choose discipline today. Reset tomorrow morning before the phone.",
      missionAlignment:
        "Mission remains sound, but daily execution is slipping. Reconnect intent to action.",
      upcomingFocus:
        "Morning reset. Mission Intent before email. Debrief on time tonight.",
    },
  },
  off_course: {
    guidance: "Return to My Standard. Act today.",
    report: {
      strongestStandard: "I do what is right.",
      greatestOpportunity: "My family comes before everything except God.",
      currentDrift:
        "Actions no longer consistently match My Standard. Work has displaced family presence.",
      suggestedCourseCorrection:
        "Family dinner tonight. No devices. Recommit to Mission Intent.",
      missionAlignment:
        "Mission pace is outpacing identity. Slow down and realign before pushing forward.",
      upcomingFocus:
        "Family first tonight. Pause new work until debrief is complete.",
    },
  },
  lost: {
    guidance: "Stop. Return to identity before action.",
    report: {
      strongestStandard: "I finish what I start.",
      greatestOpportunity: "I walk with God.",
      currentDrift:
        "Significant drift from My Standard across multiple principles. Identity has faded into autopilot.",
      suggestedCourseCorrection:
        "Begin with My Standard. One principle. One action today. Nothing else until aligned.",
      missionAlignment:
        "Mission is on hold until identity is restored. Nothing on the mission matters if I am not aligned.",
      upcomingFocus:
        "One Standard. One action. Debrief tonight — start with God.",
    },
  },
};

export function getCompassState(
  alignment: number = compassAlignmentPlaceholder
): CompassState {
  return {
    alignment,
    guidance: getGuidanceFromAlignment(alignment),
  };
}

export function getAlignmentReport(
  alignment: number = compassAlignmentPlaceholder
): AlignmentReport {
  const heading = getHeadingFromAlignment(alignment);
  const entry = compassPlaceholderByHeading[heading];
  return { alignment, ...entry.report };
}
