import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import { RadioOption } from "@/components/debrief/RadioOption";
import type { DailyDebriefDraft } from "@/types/daily-debrief";
import type { Step1Errors } from "@/lib/validate-debrief";

type StepStandardReviewProps = {
  draft: DailyDebriefDraft;
  statement: string;
  standardTotal: number;
  errors: Step1Errors;
  onAnswer: (answer: "yes" | "no") => void;
  onEvidence: (evidence: string) => void;
};

export function StepStandardReview({
  draft,
  statement,
  standardTotal,
  errors,
  onAnswer,
  onEvidence,
}: StepStandardReviewProps) {
  const entry = draft.standards[draft.standardIndex];
  const hasAnswerError = Boolean(errors.answer);
  const showEvidence = entry.answer === "yes";

  return (
    <div>
      <SectionLabel>Identity</SectionLabel>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Standard {draft.standardIndex + 1} of {standardTotal}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
          {statement}
        </p>

        <p className="mt-8 text-[15px] leading-relaxed text-muted">
          Where did you provide evidence of your identity today?
        </p>

        <div
          className={`mt-4 flex gap-3 ${hasAnswerError ? "rounded-xl ring-1 ring-amber-500/15" : ""}`}
        >
          <RadioOption
            name={`standard-${draft.standardIndex}`}
            label="Yes"
            value="yes"
            checked={entry.answer === "yes"}
            onChange={onAnswer}
          />
          <RadioOption
            name={`standard-${draft.standardIndex}`}
            label="No"
            value="no"
            checked={entry.answer === "no"}
            onChange={onAnswer}
          />
        </div>
        <ValidationMessage message={errors.answer} />

        {showEvidence ? (
          <label className="mt-8 block">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Evidence
            </span>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              This becomes permanent proof in your service record.
            </p>
            <textarea
              value={entry.evidence}
              onChange={(e) => onEvidence(e.target.value)}
              placeholder="I completed the difficult conversation I had been avoiding."
              rows={3}
              aria-invalid={Boolean(errors.evidence)}
              className={`mt-3 w-full resize-none rounded-xl border bg-surface-elevated px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.evidence))}`}
            />
            <ValidationMessage message={errors.evidence} />
          </label>
        ) : null}
      </div>
    </div>
  );
}
