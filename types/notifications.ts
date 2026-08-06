export type NotificationReminderId =
  | "morningReminder"
  | "dailyDebriefReminder"
  | "weeklyReviewReminder"
  | "monthlyReviewReminder"
  | "annualReviewReminder";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface NotificationReminderPreference {
  enabled: boolean;
  /** Local time HH:mm */
  time: string;
  /** Days of week (0 = Sunday). Weekly reminders only. */
  days?: WeekdayIndex[];
  /** Day of month (1–31). Monthly reminders only. */
  dayOfMonth?: number;
  /** Annual date as MM-DD. Annual reminders only. */
  date?: string;
}

export type NotificationSettings = Record<
  NotificationReminderId,
  NotificationReminderPreference
>;

export const WEEKDAY_LABELS: { value: WeekdayIndex; short: string }[] = [
  { value: 0, short: "S" },
  { value: 1, short: "M" },
  { value: 2, short: "T" },
  { value: 3, short: "W" },
  { value: 4, short: "T" },
  { value: 5, short: "F" },
  { value: 6, short: "S" },
];

export const NOTIFICATION_REMINDER_LABELS: Record<
  NotificationReminderId,
  {
    title: string;
    description: string;
    supportsDays?: boolean;
    supportsDayOfMonth?: boolean;
    supportsDate?: boolean;
  }
> = {
  morningReminder: {
    title: "Morning Intent",
    description: "Return to identity before action.",
  },
  dailyDebriefReminder: {
    title: "Daily Debrief",
    description: "Close the day with your Standard review.",
  },
  weeklyReviewReminder: {
    title: "Weekly Review",
    description: "Course-correct for the week ahead.",
    supportsDays: true,
  },
  monthlyReviewReminder: {
    title: "Monthly Reflection",
    description: "Step back and read the patterns.",
    supportsDayOfMonth: true,
  },
  annualReviewReminder: {
    title: "Annual Review",
    description: "Confirm who you are becoming.",
    supportsDate: true,
  },
};
