"use client";

import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionLabel } from "@/components/ui/SectionCard";

export function TodaysCommitment() {
  const { todaysMissionIntent } = useTrueNorth();

  if (!todaysMissionIntent?.commitment.trim()) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <SectionLabel>Mission Intent</SectionLabel>
      <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-lg">
        {todaysMissionIntent.commitment}
      </p>
    </section>
  );
}
