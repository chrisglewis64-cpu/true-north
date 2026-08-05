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
            View all →
          </Link>
        ) : null}
      </div>

      {preview.length === 0 ? (
        <p className="text-[15px] leading-relaxed text-muted">
          Complete a Daily Debrief to build evidence.
        </p>
      ) : (
        <ul className="space-y-1">
          {preview.map((entry) => (
            <li
              key={entry.id}
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
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                  {formatEvidenceDate(entry.debriefDate)}
                </p>
                <p className="mt-1 text-[15px] text-foreground/90 sm:text-base">
                  {entry.standardsYes[0] ?? entry.biggestWin ?? "Debrief recorded"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
