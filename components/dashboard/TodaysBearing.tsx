"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useTodaysBearing } from "@/hooks/useTodaysBearing";

/**
 * Today's operational guidance — one clear action. Never multiple.
 */
export function TodaysBearing() {
  const { todaysBearing } = useTodaysBearing();

  if (!todaysBearing) {
    return null;
  }

  return (
    <section className="animate-fade-in [animation-delay:120ms]">
      <div className="mb-3 flex items-end justify-between gap-4">
        <SectionLabel>Today&apos;s Bearing</SectionLabel>
        <Link
          href="/bearings"
          className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          This week →
        </Link>
      </div>
      <div className="border-y border-accent/30 bg-accent-glow/40 px-1 py-6 sm:py-7">
        <p className="text-center text-[18px] font-medium leading-snug tracking-tight text-foreground sm:text-[1.25rem]">
          {todaysBearing.bearing.statement}
        </p>
      </div>
    </section>
  );
}
