export type NotificationFrequency =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annually"
  | "custom";

export type NotificationReminderId =
  | "morning-check-in"
  | "daily-debrief"
  | "weekly-review"
  | "monthly-review"
  | "annual-review";

export type DailySchedule = {
  time: string;
};

export type WeeklySchedule = {
  dayOfWeek: number;
  time: string;
};

export type MonthlySchedule = {
  dayOfMonth: number;
  time: string;
};

export type QuarterlySchedule = {
  month: number;
  day: number;
  time: string;
};

export type AnnuallySchedule = {
  month: number;
  day: number;
  time: string;
};

export type CustomSchedule = Record<string, never>;

export type NotificationSchedule =
  | { frequency: "daily"; schedule: DailySchedule }
  | { frequency: "weekly"; schedule: WeeklySchedule }
  | { frequency: "monthly"; schedule: MonthlySchedule }
  | { frequency: "quarterly"; schedule: QuarterlySchedule }
  | { frequency: "annually"; schedule: AnnuallySchedule }
  | { frequency: "custom"; schedule: CustomSchedule };

export type NotificationReminder = {
  id: NotificationReminderId;
  label: string;
  message: string;
  enabled: boolean;
} & NotificationSchedule;

export type NotificationSettings = {
  reminders: NotificationReminder[];
};
