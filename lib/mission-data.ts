import type { Mission } from "@/types/mission";

export const placeholderMissions: Mission[] = [
  {
    id: "mission-1",
    name: "Lead My Family With Integrity",
    purpose:
      "Build a home rooted in faith, discipline, and unconditional presence.",
    whyThisMatters:
      "My family comes before everything except God. This season strengthens who I am as a husband and father.",
    successCriteria:
      "Consistent family dinners, daily presence, and keeping my word at home.",
    currentProgress: "Phase II — Consistency",
    nextMilestone: "Family dinner. No devices.",
    status: "active",
    missionStatus: "on_track",
    statusSource: "manual",
    statusUpdatedAt: "2025-08-01T00:00:00.000Z",
    lessonsLearned: "",
    createdAt: "2025-06-01T00:00:00.000Z",
    completedAt: null,
  },
  {
    id: "mission-2",
    name: "Discipline in My Work",
    purpose: "Pursue excellence and finish what I start in every project.",
    whyThisMatters:
      "I pursue excellence in everything I do. My work reflects my character.",
    successCriteria:
      "Every quote delivered on time. No shortcuts on quality.",
    currentProgress: "Not yet started",
    nextMilestone: "Define the first deliverable.",
    status: "upcoming",
    missionStatus: "on_track",
    statusSource: "manual",
    statusUpdatedAt: null,
    lessonsLearned: "",
    createdAt: "2025-07-15T00:00:00.000Z",
    completedAt: null,
  },
  {
    id: "mission-3",
    name: "Morning Presence With God",
    purpose: "Walk with God before the day begins.",
    whyThisMatters: "I walk with God. Everything else flows from this.",
    successCriteria: "Daily prayer before phone. Scripture every morning.",
    currentProgress: "Completed — 90 days consistent",
    nextMilestone: "—",
    status: "completed",
    missionStatus: "complete",
    statusSource: "manual",
    statusUpdatedAt: "2025-03-31T00:00:00.000Z",
    lessonsLearned:
      "Consistency matters more than duration. Five minutes before phone changed everything.",
    createdAt: "2025-01-01T00:00:00.000Z",
    completedAt: "2025-03-31T00:00:00.000Z",
  },
];

export function createMissionId(): string {
  return `mission-${Date.now()}`;
}

export function formatMissionDate(iso: string): string {
  return new Intl.DateTimeFormat("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
