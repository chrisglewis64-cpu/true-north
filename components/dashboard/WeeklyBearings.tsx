"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useTodaysBearing } from "@/hooks/useTodaysBearing";

/**
 * The three Bearings for this week — shown with Daily Commitment.
 */
export function WeeklyBearings() {
  const { weeklyBearingsList } = useTodaysBearing();

  if (weeklyBearingsList.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in [animation-delay:80ms]">
      <div className="mb-3 flex items-end justify-between gap-4">
        <SectionLabel>This Week&apos;s Bearings</SectionLabel>
        <Link
          href="/bearings"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          Adjust →
        </Link>
      </div>
      <ol className="space-y-3">
        {weeklyBearingsList.map((bearing, index) => (
          <li
            key={bearing.id}
            className="flex gap-3 text-[15px] leading-relaxed text-foreground/90"
          >
            <span className="font-mono text-[11px] text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{bearing.statement}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
