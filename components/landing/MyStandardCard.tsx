"use client";

import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";

export function MyStandardCard() {
  const { myStandard } = useTrueNorth();

  return (
    <SectionCard className="animate-fade-in [animation-delay:80ms]">
      <SectionLabel>Personal Standards</SectionLabel>
      <ul className="space-y-4">
        {myStandard.map((principle) => (
          <li
            key={principle.id}
            className="flex gap-3 text-[15px] leading-relaxed text-foreground/90 sm:text-base"
          >
            <span className="shrink-0 text-muted" aria-hidden>
              •
            </span>
            <span>{principle.statement}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
