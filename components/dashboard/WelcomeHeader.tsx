"use client";

import { useTrueNorth } from "@/context/TrueNorthContext";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(): string {
  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function WelcomeHeader() {
  const { session } = useTrueNorth();

  return (
    <header className="animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            True North
          </p>
          <h1 className="mt-2 text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.25rem]">
            {getGreeting()}, {session.displayName}.
          </h1>
        </div>
        <time
          dateTime={new Date().toISOString().split("T")[0]}
          className="shrink-0 pt-1 text-right font-mono text-xs text-muted"
        >
          {formatDate()}
        </time>
      </div>
    </header>
  );
}
