"use client";

import { SectionLabel } from "@/components/ui/SectionCard";
import { Toggle } from "@/components/ui/Toggle";
import { SelectField, TimeField } from "@/components/settings/ScheduleFields";
import {
  DAY_OF_WEEK_OPTIONS,
  FREQUENCY_OPTIONS,
  MONTH_OPTIONS,
  dayOfMonthOptions,
} from "@/lib/notifications/schedule-options";
import type {
  NotificationFrequency,
  NotificationReminder,
  NotificationReminderId,
} from "@/types/notifications";

type NotificationReminderCardProps = {
  reminder: NotificationReminder;
  onEnabledChange: (id: NotificationReminderId, enabled: boolean) => void;
  onFrequencyChange: (
    id: NotificationReminderId,
    frequency: NotificationFrequency
  ) => void;
  onScheduleChange: (
    id: NotificationReminderId,
    schedule: NotificationReminder["schedule"]
  ) => void;
};

export function NotificationReminderCard({
  reminder,
  onEnabledChange,
  onFrequencyChange,
  onScheduleChange,
}: NotificationReminderCardProps) {
  const disabled = !reminder.enabled;
  const isCustom = reminder.frequency === "custom";

  return (
    <article
      className={`rounded-2xl border bg-surface p-5 transition-opacity sm:p-6 ${
        disabled ? "border-border opacity-70" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[16px] font-medium tracking-tight text-foreground/95 sm:text-[17px]">
            {reminder.label}
          </h3>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            {reminder.message}
          </p>
        </div>
        <Toggle
          checked={reminder.enabled}
          onChange={(enabled) => onEnabledChange(reminder.id, enabled)}
          label={`Enable ${reminder.label}`}
        />
      </div>

      <div className="mt-6 space-y-5 border-t border-border pt-6">
        <div>
          <SectionLabel>Frequency</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {FREQUENCY_OPTIONS.map((option) => {
              const selected = reminder.frequency === option.value;
              const isDisabled = disabled || option.disabled;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() =>
                    onFrequencyChange(reminder.id, option.value)
                  }
                  className={`rounded-xl border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
                    selected
                      ? "border-accent/50 bg-accent-glow text-accent"
                      : "border-border bg-surface-elevated text-muted hover:border-border-subtle hover:text-foreground/80"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {option.label}
                  {option.disabled ? " · Soon" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {isCustom ? (
          <p className="rounded-xl border border-dashed border-border-subtle bg-surface-elevated px-4 py-3 text-[14px] text-muted">
            Custom schedules will be available in a future release.
          </p>
        ) : (
          <ScheduleFields
            reminder={reminder}
            disabled={disabled}
            onScheduleChange={onScheduleChange}
          />
        )}
      </div>
    </article>
  );
}

function ScheduleFields({
  reminder,
  disabled,
  onScheduleChange,
}: {
  reminder: NotificationReminder;
  disabled: boolean;
  onScheduleChange: (
    id: NotificationReminderId,
    schedule: NotificationReminder["schedule"]
  ) => void;
}) {
  const { id, frequency, schedule } = reminder;

  switch (frequency) {
    case "daily":
      return (
        <TimeField
          id={`${id}-time`}
          value={schedule.time}
          disabled={disabled}
          onChange={(time) => onScheduleChange(id, { time })}
        />
      );

    case "weekly":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id={`${id}-day`}
            label="Day of week"
            value={schedule.dayOfWeek}
            disabled={disabled}
            onChange={(value) =>
              onScheduleChange(id, {
                ...schedule,
                dayOfWeek: Number(value),
              })
            }
            options={DAY_OF_WEEK_OPTIONS}
          />
          <TimeField
            id={`${id}-time`}
            value={schedule.time}
            disabled={disabled}
            onChange={(time) => onScheduleChange(id, { ...schedule, time })}
          />
        </div>
      );

    case "monthly":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id={`${id}-day`}
            label="Day of month"
            value={schedule.dayOfMonth}
            disabled={disabled}
            onChange={(value) =>
              onScheduleChange(id, {
                ...schedule,
                dayOfMonth: Number(value),
              })
            }
            options={dayOfMonthOptions()}
          />
          <TimeField
            id={`${id}-time`}
            value={schedule.time}
            disabled={disabled}
            onChange={(time) => onScheduleChange(id, { ...schedule, time })}
          />
        </div>
      );

    case "quarterly":
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          <SelectField
            id={`${id}-month`}
            label="Month"
            value={schedule.month}
            disabled={disabled}
            onChange={(value) =>
              onScheduleChange(id, {
                ...schedule,
                month: Number(value),
              })
            }
            options={MONTH_OPTIONS}
          />
          <SelectField
            id={`${id}-day`}
            label="Day"
            value={schedule.day}
            disabled={disabled}
            onChange={(value) =>
              onScheduleChange(id, {
                ...schedule,
                day: Number(value),
              })
            }
            options={dayOfMonthOptions()}
          />
          <TimeField
            id={`${id}-time`}
            value={schedule.time}
            disabled={disabled}
            onChange={(time) => onScheduleChange(id, { ...schedule, time })}
          />
        </div>
      );

    case "annually":
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id={`${id}-month`}
              label="Date"
              value={schedule.month}
              disabled={disabled}
              onChange={(value) =>
                onScheduleChange(id, {
                  ...schedule,
                  month: Number(value),
                })
              }
              options={MONTH_OPTIONS}
            />
            <SelectField
              id={`${id}-day`}
              label="Day"
              value={schedule.day}
              disabled={disabled}
              onChange={(value) =>
                onScheduleChange(id, {
                  ...schedule,
                  day: Number(value),
                })
              }
              options={dayOfMonthOptions()}
            />
          </div>
          <TimeField
            id={`${id}-time`}
            value={schedule.time}
            disabled={disabled}
            onChange={(time) => onScheduleChange(id, { ...schedule, time })}
          />
        </div>
      );

    default:
      return null;
  }
}
