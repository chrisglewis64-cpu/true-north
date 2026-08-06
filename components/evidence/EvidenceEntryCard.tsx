import { formatEvidenceDate } from "@/lib/evidence/build-evidence-entries";
import type { EvidenceEntry } from "@/types/evidence";

type EvidenceEntryCardProps = {
  entry: EvidenceEntry;
};

/**
 * Service-record style proof entry.
 * Read-only — Evidence is permanent history.
 */
export function EvidenceEntryCard({ entry }: EvidenceEntryCardProps) {
  return (
    <article className="border-b border-border pb-8 last:border-0 last:pb-0">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {formatEvidenceDate(entry.evidenceDate)}
      </p>

      <p className="mt-4 text-[17px] font-medium leading-relaxed tracking-tight text-foreground sm:text-lg">
        &ldquo;{entry.standardStatement}&rdquo;
      </p>

      <div className="mt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Evidence
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-foreground/85 sm:text-base">
          {entry.evidenceText}
        </p>
      </div>

      {entry.missionReference ? (
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted/80">
          Mission · {entry.missionReference}
        </p>
      ) : null}
    </article>
  );
}
