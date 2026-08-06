"use client";

import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useEvidenceEntries } from "@/hooks/useEvidenceEntries";
import { formatEvidenceDate } from "@/lib/evidence/build-evidence-entries";

export function Evidence() {
  const entries = useEvidenceEntries();
  const preview = entries.slice(0, 3);

  return (
    <section className="animate-fade-in [animation-delay:240ms]">
      <div className="mb-3 flex items-end justify-between gap-4">
        <SectionLabel>Evidence</SectionLabel>
        {entries.length > 0 ? (
          <Link
            href="/evidence"
            className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            Service record →
          </Link>
        ) : null}
      </div>

      {preview.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted">
          Proof accumulates when you live a standard and record it in Debrief.
        </p>
      ) : (
        <ul className="space-y-1">
          {preview.map((entry) => (
            <li
              key={entry.id}
              className="border-b border-border py-4 last:border-0"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                {formatEvidenceDate(entry.evidenceDate)}
              </p>
              <p className="mt-1.5 text-[15px] font-medium text-foreground/90 sm:text-base">
                &ldquo;{entry.standardStatement}&rdquo;
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-muted">
                {entry.evidenceText}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
