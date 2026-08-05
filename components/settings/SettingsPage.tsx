"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { NotificationReminderCard } from "@/components/settings/NotificationReminderCard";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

export function SettingsPage() {
  const { settings, setEnabled, setFrequency, updateSchedule } =
    useNotificationSettings();

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <Link
            href="/review"
            className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            ← Review
          </Link>
          <SectionLabel>Settings</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Preferences
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Configure reminders to stay aligned with your standard and review
            rhythm.
          </p>
        </header>

        <section className="mt-12 animate-fade-in [animation-delay:80ms]">
          <SectionLabel>Notifications</SectionLabel>
          <p className="mb-6 text-[14px] leading-relaxed text-muted">
            Each reminder can be enabled independently. Adjust frequency and
            timing to match your operating rhythm.
          </p>

          <div className="space-y-5">
            {settings.reminders.map((reminder, index) => (
              <div
                key={reminder.id}
                className="animate-fade-in"
                style={{ animationDelay: `${120 + index * 60}ms` }}
              >
                <NotificationReminderCard
                  reminder={reminder}
                  onEnabledChange={setEnabled}
                  onFrequencyChange={setFrequency}
                  onScheduleChange={updateSchedule}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
