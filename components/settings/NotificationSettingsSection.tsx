"use client";

import {
  NOTIFICATION_REMINDER_LABELS,
  type NotificationReminderId,
} from "@/types/notifications";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

const REMINDER_ORDER: NotificationReminderId[] = [
  "morningReminder",
  "dailyDebriefReminder",
  "weeklyReviewReminder",
  "monthlyReviewReminder",
  "annualReviewReminder",
];

export function NotificationSettingsSection() {
  const { settings, updateReminder, permissionState, requestPermission } =
    useNotificationSettings();

  return (
    <section>
      <SectionLabel>Notifications</SectionLabel>
      <SectionCard className="space-y-6">
        <p className="text-[15px] leading-relaxed text-muted">
          Reminders are saved locally for now. Browser notifications will be
          wired to this section in a future version.
        </p>

        {permissionState === "unsupported" ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Browser notifications not supported on this device.
          </p>
        ) : permissionState !== "granted" ? (
          <button
            type="button"
            onClick={() => void requestPermission()}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            Enable browser notifications (placeholder)
          </button>
        ) : null}

        <ul className="space-y-5">
          {REMINDER_ORDER.map((id) => {
            const meta = NOTIFICATION_REMINDER_LABELS[id];
            const preference = settings[id];

            return (
              <li
                key={id}
                className="border-b border-border pb-5 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium text-foreground">
                      {meta.title}
                    </p>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">
                      {meta.description}
                    </p>
                  </div>
                  <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preference.enabled}
                      onChange={(event) =>
                        updateReminder(id, { enabled: event.target.checked })
                      }
                      className="peer sr-only"
                    />
                    <span className="h-7 w-12 rounded-full bg-border transition-colors peer-checked:bg-accent/80" />
                    <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-foreground transition-transform peer-checked:translate-x-5" />
                  </label>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`${id}-time`}
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                  >
                    Reminder time
                  </label>
                  <input
                    id={`${id}-time`}
                    type="time"
                    value={preference.time}
                    disabled={!preference.enabled}
                    onChange={(event) =>
                      updateReminder(id, { time: event.target.value })
                    }
                    className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:opacity-40"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </section>
  );
}
