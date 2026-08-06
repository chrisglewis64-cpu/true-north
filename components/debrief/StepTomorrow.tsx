import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import type { DailyDebriefDraft } from "@/types/daily-debrief";
import type { Step3Errors } from "@/lib/validate-debrief";

type StepTomorrowProps = {
  draft: DailyDebriefDraft;
  errors: Step3Errors;
  summary?: string;
  onChange: (
    field: "tomorrowOnePercent" | "tomorrowPriority",
    value: string
  ) => void;
};

export function StepTomorrow({
  draft,
  errors,
  summary,
  onChange,
}: StepTomorrowProps) {
  return (
    <div className="space-y-8">
      <div>
        <SectionLabel>Tomorrow</SectionLabel>
        <p className="mt-2 text-[15px] text-muted">
          Set your direction for tomorrow. Both fields are required.
        </p>
      </div>

      <ValidationSummary message={summary} />

      <div>
        <label className="block" htmlFor="field-tomorrowOnePercent">
          <SectionLabel>Tomorrow&apos;s 1%</SectionLabel>
          <input
            id="field-tomorrowOnePercent"
            type="text"
            value={draft.tomorrowOnePercent}
            onChange={(e) => onChange("tomorrowOnePercent", e.target.value)}
            placeholder="One small improvement."
            aria-invalid={Boolean(errors.tomorrowOnePercent)}
            className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.tomorrowOnePercent))}`}
          />
        </label>
        <ValidationMessage message={errors.tomorrowOnePercent} />
      </div>

      <div>
        <label className="block" htmlFor="field-tomorrowPriority">
          <SectionLabel>Tomorrow&apos;s Priority</SectionLabel>
          <input
            id="field-tomorrowPriority"
            type="text"
            value={draft.tomorrowPriority}
            onChange={(e) => onChange("tomorrowPriority", e.target.value)}
            placeholder="One thing that matters most."
            aria-invalid={Boolean(errors.tomorrowPriority)}
            className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.tomorrowPriority))}`}
          />
        </label>
        <ValidationMessage message={errors.tomorrowPriority} />
      </div>
    </div>
  );
}
