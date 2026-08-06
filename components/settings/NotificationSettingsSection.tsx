"use client";

import {
  NOTIFICATION_REMINDER_LABELS,
  WEEKDAY_LABELS,
  type NotificationReminderId,
  type WeekdayIndex,
} from "@/types/notifications";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";
import { DEFAULT_NOTIFICATION_SETTINGS } from "@/lib/notifications/defaults";
import { NOTIFICATIONS_FEATURE_ENABLED } from "@/lib/notifications/feature";
import {
  annualDateFromInputValue,
  annualDateToInputValue,
} from "@/lib/notifications/storage";

const REMINDER_ORDER: NotificationReminderId[] = [
  "morningReminder",
  "dailyDebriefReminder",
  "weeklyReviewReminder",
  "monthlyReviewReminder",
  "annualReviewReminder",
];

const DAY_OF_MONTH_OPTIONS = Array.from({ length: 31 }, (_, index) => index + 1);

export function NotificationSettingsSection() {
  const {
    settings: liveSettings,
    updateReminder,
    isLoading,
    saveError,
    permissionMessage,
  } = useNotificationSettings();

  // When paused, show planned defaults so the section remains visible and stable.
  const settings = NOTIFICATIONS_FEATURE_ENABLED
    ? liveSettings
    : DEFAULT_NOTIFICATION_SETTINGS;
  const controlsDisabled = !NOTIFICATIONS_FEATURE_ENABLED || isLoading;

  function toggleDay(id: NotificationReminderId, day: WeekdayIndex) {
    if (!NOTIFICATIONS_FEATURE_ENABLED) {
      return;
    }

    const current = settings[id].days ?? [];
    const next = current.includes(day)
      ? current.filter((value) => value !== day)
      : [...current, day].sort((a, b) => a - b);

    void updateReminder(id, {
      days: next.length > 0 ? (next as WeekdayIndex[]) : [day],
    });
  }

  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <SectionLabel>Notifications</SectionLabel>
        {!NOTIFICATIONS_FEATURE_ENABLED ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            Coming soon
          </span>
        ) : null}
      </div>

      <SectionCard className="space-y-6">
        <p className="text-[15px] leading-relaxed text-muted">
          {NOTIFICATIONS_FEATURE_ENABLED
            ? "Intentional reminders. Quiet by default — enable only what serves you."
            : "Personal reminders will be available in a future update."}
        </p>

        {NOTIFICATIONS_FEATURE_ENABLED && isLoading ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            Restoring preferences…
          </p>
        ) : null}

        {NOTIFICATIONS_FEATURE_ENABLED && permissionMessage ? (
          <p className="text-[14px] leading-relaxed text-muted">
            {permissionMessage}
          </p>
        ) : null}

        {NOTIFICATIONS_FEATURE_ENABLED && saveError ? (
          <p className="text-[14px] leading-relaxed text-red-400">{saveError}</p>
        ) : null}

        <ul className={`space-y-5 ${controlsDisabled ? "opacity-70" : ""}`}>
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
                  <label
                    className={`relative inline-flex shrink-0 items-center ${
                      controlsDisabled ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    <span className="sr-only">Enabled</span>
                    <input
                      type="checkbox"
                      checked={preference.enabled}
                      disabled={controlsDisabled}
                      onChange={(event) => {
                        if (!NOTIFICATIONS_FEATURE_ENABLED) {
                          return;
                        }
                        void updateReminder(id, {
                          enabled: event.target.checked,
                        });
                      }}
                      className="peer sr-only"
                    />
                    <span className="h-7 w-12 rounded-full bg-border transition-colors peer-checked:bg-accent/80 peer-disabled:opacity-50" />
                    <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-foreground transition-transform peer-checked:translate-x-5 peer-disabled:opacity-50" />
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
                    disabled={
                      controlsDisabled ||
                      (NOTIFICATIONS_FEATURE_ENABLED && !preference.enabled)
                    }
                    onChange={(event) => {
                      if (!NOTIFICATIONS_FEATURE_ENABLED) {
                        return;
                      }
                      void updateReminder(id, { time: event.target.value });
                    }}
                    className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:opacity-40"
                  />
                </div>

                {meta.supportsDays ? (
                  <div className="mt-4">
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      Weekday
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
                            disabled={
                              controlsDisabled ||
                              (NOTIFICATIONS_FEATURE_ENABLED &&
                                !preference.enabled)
                            }
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

                {meta.supportsDayOfMonth ? (
                  <div className="mt-4">
                    <label
                      htmlFor={`${id}-day-of-month`}
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                    >
                      Day of month
                    </label>
                    <select
                      id={`${id}-day-of-month`}
                      value={preference.dayOfMonth ?? 1}
                      disabled={
                        controlsDisabled ||
                        (NOTIFICATIONS_FEATURE_ENABLED && !preference.enabled)
                      }
                      onChange={(event) => {
                        if (!NOTIFICATIONS_FEATURE_ENABLED) {
                          return;
                        }
                        void updateReminder(id, {
                          dayOfMonth: Number(event.target.value),
                        });
                      }}
                      className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:opacity-40"
                    >
                      {DAY_OF_MONTH_OPTIONS.map((day) => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {meta.supportsDate ? (
                  <div className="mt-4">
                    <label
                      htmlFor={`${id}-date`}
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted"
                    >
                      Date
                    </label>
                    <input
                      id={`${id}-date`}
                      type="date"
                      value={annualDateToInputValue(preference.date)}
                      disabled={
                        controlsDisabled ||
                        (NOTIFICATIONS_FEATURE_ENABLED && !preference.enabled)
                      }
                      onChange={(event) => {
                        if (!NOTIFICATIONS_FEATURE_ENABLED) {
                          return;
                        }
                        void updateReminder(id, {
                          date: annualDateFromInputValue(event.target.value),
                        });
                      }}
                      className="rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm text-foreground disabled:opacity-40"
                    />
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
