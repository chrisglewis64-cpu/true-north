import type {
  AnnualReview,
  MonthlyReview,
  WeeklyReview,
} from "@/types/review";

export const weeklyReviewPlaceholder: WeeklyReview = {
  weekLabel: "28 Jul – 3 Aug 2026",
  weekStarting: "2026-07-28",
  missionName: "Lead My Family With Integrity",
  missionPurpose:
    "Build a home rooted in faith, discipline, and unconditional presence.",
  missionStatus: "on_track",
  missionIntent: "Family dinner. No devices.",
  missionIntentSuccess: "Honored",
  standardPerformance: [
    { order: 1, statement: "I walk with God.", rating: "Strong" },
    {
      order: 2,
      statement: "My family comes before everything except God.",
      rating: "Strong",
    },
    { order: 3, statement: "I keep my word.", rating: "Inconsistent" },
    { order: 4, statement: "I do what is right.", rating: "Strong" },
    {
      order: 5,
      statement: "I choose discipline over comfort.",
      rating: "Inconsistent",
    },
    {
      order: 6,
      statement: "I pursue excellence in everything I do.",
      rating: "Strong",
    },
    { order: 7, statement: "I improve every day.", rating: "Strong" },
    { order: 8, statement: "I finish what I start.", rating: "Inconsistent" },
  ],
  biggestWin:
    "Led family dinner four nights with full presence. No devices at the table.",
  biggestLesson:
    "Presence matters more than duration. Thirty focused minutes beats two distracted hours.",
  courseCorrection:
    "Protect the evening debrief. Honour today's bearing before the day ends.",
  planNextWeek:
    "One family dinner. Phone away earlier. Debrief every night without exception.",
};

export const monthlyReviewPlaceholder: MonthlyReview = {
  monthLabel: "August 2026",
  missionName: "Lead My Family With Integrity",
  missionProgress: "Phase II — Consistency",
  missionProgressNarrative:
    "Moved from intention to practice on family dinners. The mission is no longer aspirational — it is becoming character.",
  patterns: [
    "Debrief consistency dropped mid-month when work intensified.",
    "Strongest alignment: family and integrity principles.",
    "Weakest: morning presence before the day begins.",
  ],
  achievements: [
    "Completed Morning Presence With God mission.",
    "Twenty-one consecutive debriefs in the first three weeks.",
    "Kept my word on every client deliverable.",
  ],
  lessons: [
    "Alignment beats motivation when the week gets hard.",
    "Small acts of integrity compound when recorded as evidence.",
    "Course corrections only work when written down the same night.",
  ],
  priorities: [
    "Protect evening debrief — non-negotiable.",
    "Advance family mission to Phase III.",
    "Restore morning bearing before phone.",
  ],
};

export const annualReviewPlaceholder: AnnualReview = {
  year: 2026,
  completedMissions: [
    {
      name: "Morning Presence With God",
      completedLabel: "Completed March 2026",
      lessonsLearned:
        "Consistency matters more than duration. Five minutes before phone changed everything.",
    },
    {
      name: "Discipline in My Work",
      completedLabel: "Completed June 2026",
      lessonsLearned:
        "Excellence is a daily choice, not a project milestone. Finish what I start.",
    },
  ],
  greatestWins: [
    "Built a home where my word is kept.",
    "Finished what I started on three major projects.",
    "Never missed more than two debriefs in any month.",
  ],
  greatestLessons: [
    "Identity precedes performance.",
    "Never miss the debrief.",
    "My family comes before everything except God — and they felt it this year.",
  ],
  identityGrowth:
    "I am more present. I am more disciplined. I lead my family with integrity — not perfectly, but consistently. I walk with God before I walk into the day. I keep my word. I finish what I start.",
  letterToFutureMe: `Dear Chris,

This year you chose discipline over comfort more often than not. You protected the debrief when it was hard. You showed up for your family when work pulled at you.

You are not the man you were in January. You are closer to the man you chose to become.

Keep the standard. Keep the debrief. Keep building.

— Chris`,
  letterSignedDate: "August 2026",
};

export const reviewHubMeta = {
  weekly: {
    period: weeklyReviewPlaceholder.weekLabel,
    subtitle: "Mission · Standards · Course",
  },
  monthly: {
    period: monthlyReviewPlaceholder.monthLabel,
    subtitle: "Patterns · Achievements · Lessons",
  },
  annual: {
    period: String(annualReviewPlaceholder.year),
    subtitle: "Identity · Proof · Future letter",
  },
};
