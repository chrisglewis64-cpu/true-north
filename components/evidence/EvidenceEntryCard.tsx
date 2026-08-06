import { SectionLabel, SectionCard } from "@/components/ui/SectionCard";
import { formatEvidenceDate } from "@/lib/evidence/build-evidence-entries";
import type { DebriefEvidenceEntry } from "@/types/evidence";

type EvidenceEntryCardProps = {
  entry: DebriefEvidenceEntry;
};

function EvidenceField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      <div className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
        {children}
      </div>
    </div>
  );
}

export function EvidenceEntryCard({ entry }: EvidenceEntryCardProps) {
  return (
    <SectionCard>
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        {formatEvidenceDate(entry.debriefDate)}
      </p>

      <div className="mt-6 space-y-6">
        <EvidenceField label="Mission Intent">
          {entry.missionIntent ?? "—"}
        </EvidenceField>

        <EvidenceField label="Standards marked Yes">
          {entry.standardsYes.length > 0 ? (
            <ul className="space-y-2">
              {entry.standardsYes.map((statement) => (
                <li key={statement} className="flex gap-3">
                  <span className="shrink-0 text-accent" aria-hidden>
                    ✓
                  </span>
                  <span>{statement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted">None recorded</span>
          )}
        </EvidenceField>

        <EvidenceField label="Biggest Win">
          {entry.biggestWin || "—"}
        </EvidenceField>

        <EvidenceField label="Lesson">
          {entry.biggestLesson || "—"}
        </EvidenceField>

        <EvidenceField label="Course Correction">
          {entry.courseCorrection || "—"}
        </EvidenceField>
      </div>
    </SectionCard>
  );
}
