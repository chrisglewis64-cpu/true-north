import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import type { DailyDebriefDraft } from "@/types/daily-debrief";
import type { Step2Errors } from "@/lib/validate-debrief";

type StepReflectionProps = {
  draft: DailyDebriefDraft;
  errors: Step2Errors;
  summary?: string;
  onChange: (field: "biggestWin" | "biggestLesson", value: string) => void;
};

export function StepReflection({
  draft,
  errors,
  summary,
  onChange,
}: StepReflectionProps) {
  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Reflection</SectionLabel>
        <p className="mt-2 text-[15px] text-muted">
          Name the truth from today. Both fields are required.
        </p>
      </div>

      <ValidationSummary message={summary} />

      <div>
        <label className="block" htmlFor="field-biggestWin">
          <SectionLabel>Biggest Win</SectionLabel>
          <input
            id="field-biggestWin"
            type="text"
            value={draft.biggestWin}
            onChange={(e) => onChange("biggestWin", e.target.value)}
            placeholder="Name it."
            aria-invalid={Boolean(errors.biggestWin)}
            className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.biggestWin))}`}
          />
        </label>
        <ValidationMessage message={errors.biggestWin} />
      </div>

      <div>
        <label className="block" htmlFor="field-biggestLesson">
          <SectionLabel>Biggest Lesson</SectionLabel>
          <input
            id="field-biggestLesson"
            type="text"
            value={draft.biggestLesson}
            onChange={(e) => onChange("biggestLesson", e.target.value)}
            placeholder="Name it."
            aria-invalid={Boolean(errors.biggestLesson)}
            className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.biggestLesson))}`}
          />
        </label>
        <ValidationMessage message={errors.biggestLesson} />
      </div>
    </div>
  );
}
