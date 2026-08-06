"use client";

import {
  NOTIFICATION_REMINDER_LABELS,
  WEEKDAY_LABELS,
  type NotificationReminderId,
  type WeekdayIndex,
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

  function toggleDay(id: NotificationReminderId, day: WeekdayIndex) {
    const current = settings[id].days ?? [];
    const next = current.includes(day)
      ? current.filter((value) => value !== day)
      : [...current, day].sort((a, b) => a - b);

    updateReminder(id, {
      days: next.length > 0 ? (next as WeekdayIndex[]) : [day],
    });
  }

  return (
    <section>
      <SectionLabel>Notifications</SectionLabel>
      <SectionCard className="space-y-6">
        <p className="text-[15px] leading-relaxed text-muted">
          Intentional reminders. Quiet by default — enable only what serves you.
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
            Enable browser notifications
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
                    <span className="sr-only">Enabled</span>
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
                    Time
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

                {meta.supportsDays ? (
                  <div className="mt-4">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Days
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAY_LABELS.map((day) => {
                        const active = (preference.days ?? []).includes(
                          day.value
                        );
                        return (
                          <button
                            key={`${id}-${day.value}`}
                            type="button"
                            disabled={!preference.enabled}
                            onClick={() => toggleDay(id, day.value)}
                            className={`flex h-9 w-9 items-center justify-center rounded-full font-mono text-[11px] transition-colors disabled:opacity-40 ${
                              active
                                ? "bg-accent text-white"
                                : "border border-border text-muted hover:border-border-subtle hover:text-foreground"
                            }`}
                            aria-pressed={active}
                          >
                            {day.short}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </SectionCard>
    </section>
  );
}
