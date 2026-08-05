import type { NotificationSettings } from "@/types/notifications";

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  morningReminder: { enabled: false, time: "07:00" },
  dailyDebriefReminder: { enabled: false, time: "20:30" },
  weeklyReviewReminder: { enabled: false, time: "09:00" },
  monthlyReviewReminder: { enabled: false, time: "09:00" },
  annualReviewReminder: { enabled: false, time: "09:00" },
};
