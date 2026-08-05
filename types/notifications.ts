export type NotificationReminderId =
  | "morningReminder"
  | "dailyDebriefReminder"
  | "weeklyReviewReminder"
  | "monthlyReviewReminder"
  | "annualReviewReminder";

export interface NotificationReminderPreference {
  enabled: boolean;
  /** Local time HH:mm */
  time: string;
}

export type NotificationSettings = Record<
  NotificationReminderId,
  NotificationReminderPreference
>;

export const NOTIFICATION_REMINDER_LABELS: Record<
  NotificationReminderId,
  { title: string; description: string }
> = {
  morningReminder: {
    title: "Morning Reminder",
    description: "Return to identity before action.",
  },
  dailyDebriefReminder: {
    title: "Daily Debrief Reminder",
    description: "Close the day with your Standard review.",
  },
  weeklyReviewReminder: {
    title: "Weekly Review Reminder",
    description: "Course-correct for the week ahead.",
  },
  monthlyReviewReminder: {
    title: "Monthly Review Reminder",
    description: "Step back and read the patterns.",
  },
  annualReviewReminder: {
    title: "Annual Review Reminder",
    description: "Confirm who you are becoming.",
  },
};
