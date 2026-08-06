"use client";

import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionLabel } from "@/components/ui/SectionCard";

export function TodaysOnePercent() {
  const { todaysOnePercent } = useTrueNorth();

  if (!todaysOnePercent.improvement.trim()) {
    return null;
  }

  return (
    <section className="animate-fade-in [animation-delay:160ms]">
      <SectionLabel>Today&apos;s 1%</SectionLabel>
      <div className="rounded-2xl border border-accent/25 bg-accent-glow px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
          {todaysOnePercent.improvement}
        </p>
      </div>
    </section>
  );
}
