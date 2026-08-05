"use client";

import { formatEvidenceEntryDate } from "@/lib/evidence/build-evidence-entries";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useEvidenceEntries } from "@/hooks/useEvidenceEntries";

type EvidenceListProps = {
  limit?: number;
  emptyMessage?: string;
};

export function EvidenceList({
  limit,
  emptyMessage = "Complete a Daily Debrief to generate evidence.",
}: EvidenceListProps) {
  const entries = useEvidenceEntries(limit);

  if (entries.length === 0) {
    return (
      <p className="text-[15px] leading-relaxed text-muted">{emptyMessage}</p>
    );
  }

  return (
    <ul className="space-y-1">
      {entries.map((item) => (
        <li
          key={item.id}
          className="flex items-start gap-3 border-b border-border py-3 last:border-0"
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-accent">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8.5l3.5 3.5 6.5-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] text-foreground/90 sm:text-base">
              {item.label}
            </p>
            {limit === undefined ? (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {formatEvidenceEntryDate(item.date)}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

type EvidenceSectionProps = {
  limit?: number;
  showLabel?: boolean;
};

export function EvidenceSection({
  limit,
  showLabel = true,
}: EvidenceSectionProps) {
  return (
    <section className="animate-fade-in [animation-delay:240ms]">
      {showLabel ? <SectionLabel>Evidence</SectionLabel> : null}
      <EvidenceList limit={limit} />
    </section>
  );
}
