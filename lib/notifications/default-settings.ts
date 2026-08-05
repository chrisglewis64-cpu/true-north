import type {
  NotificationFrequency,
  NotificationReminder,
  NotificationSchedule,
  NotificationSettings,
} from "@/types/notifications";

function defaultScheduleForFrequency(
  frequency: NotificationFrequency
): NotificationSchedule {
  switch (frequency) {
    case "daily":
      return { frequency: "daily", schedule: { time: "06:30" } };
    case "weekly":
      return {
        frequency: "weekly",
        schedule: { dayOfWeek: 0, time: "18:00" },
      };
    case "monthly":
      return {
        frequency: "monthly",
        schedule: { dayOfMonth: 1, time: "09:00" },
      };
    case "quarterly":
      return {
        frequency: "quarterly",
        schedule: { month: 1, day: 1, time: "09:00" },
      };
    case "annually":
      return {
        frequency: "annually",
        schedule: { month: 1, day: 1, time: "09:00" },
      };
    case "custom":
      return { frequency: "custom", schedule: {} };
  }
}

export function createDefaultNotificationSettings(): NotificationSettings {
  const reminders: NotificationReminder[] = [
    {
      id: "morning-check-in",
      label: "Morning Check-in",
      message:
        "Begin the day with intention. Confirm your identity and mission intent before operations.",
      enabled: true,
      frequency: "daily",
      schedule: { time: "06:30" },
    },
    {
      id: "daily-debrief",
      label: "Daily Debrief",
      message:
        "Close the loop on today. Review your standard, capture evidence, and set tomorrow's 1%.",
      enabled: true,
      frequency: "daily",
      schedule: { time: "20:00" },
    },
    {
      id: "weekly-review",
      label: "Weekly Review",
      message:
        "Step back and assess the week. What held course, what drifted, and what needs correction.",
      enabled: true,
      frequency: "weekly",
      schedule: { dayOfWeek: 0, time: "18:00" },
    },
    {
      id: "monthly-review",
      label: "Monthly Review",
      message:
        "Evaluate progress against your mission. Adjust priorities and renew commitment for the month ahead.",
      enabled: false,
      frequency: "monthly",
      schedule: { dayOfMonth: 1, time: "09:00" },
    },
    {
      id: "annual-review",
      label: "Annual Review",
      message:
        "A full accounting of the year. Reflect on growth, recalibrate your standard, and set direction.",
      enabled: false,
      frequency: "annually",
      schedule: { month: 1, day: 1, time: "09:00" },
    },
  ];

  return { reminders };
}

export function applyFrequencyChange(
  reminder: NotificationReminder,
  frequency: NotificationFrequency
): NotificationReminder {
  const next = defaultScheduleForFrequency(frequency);

  return {
    id: reminder.id,
    label: reminder.label,
    message: reminder.message,
    enabled: reminder.enabled,
    frequency: next.frequency,
    schedule: next.schedule,
  } as NotificationReminder;
}
