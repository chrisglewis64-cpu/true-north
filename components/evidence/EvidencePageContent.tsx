"use client";

import Link from "next/link";
import { BottomNav } from "@/components/navigation/BottomNav";
import { EvidenceEntryCard } from "@/components/evidence/EvidenceEntryCard";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useEvidenceEntries } from "@/hooks/useEvidenceEntries";

export function EvidencePageContent() {
  const entries = useEvidenceEntries();

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in mb-10">
          <SectionLabel>Evidence</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Proof you lived your Standard.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Each completed Daily Debrief becomes evidence — automatically.
          </p>
        </header>

        {entries.length === 0 ? (
          <div className="animate-fade-in rounded-2xl border border-border bg-surface p-6 text-center sm:p-8">
            <p className="text-[15px] leading-relaxed text-muted">
              Complete your first Daily Debrief to begin building evidence.
            </p>
            <Link
              href="/debrief"
              className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              Go to Daily Debrief →
            </Link>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {entries.map((entry, index) => (
              <div
                key={entry.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <EvidenceEntryCard entry={entry} />
              </div>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
