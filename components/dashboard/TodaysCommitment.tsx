"use client";

import { useApp } from "@/context/AppContext";
import { SectionLabel } from "@/components/ui/SectionCard";

export function TodaysCommitment() {
  const { todaysCommitment } = useApp();

  if (!todaysCommitment.trim()) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <SectionLabel>Mission Intent</SectionLabel>
      <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-lg">
        {todaysCommitment}
      </p>
    </section>
  );
}
