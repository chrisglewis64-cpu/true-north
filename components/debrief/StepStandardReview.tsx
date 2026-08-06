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

  return (
    <div>
      <SectionLabel>Review My Standard</SectionLabel>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Standard {draft.standardIndex + 1} of {standardTotal}
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
          {statement}
        </p>

        <p className="mt-8 text-[15px] text-muted">
          Did I live this today?
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

        <label className="mt-8 block">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Evidence{" "}
            <span className="normal-case tracking-normal text-muted/70">
              (optional)
            </span>
          </span>
          <input
            type="text"
            value={entry.evidence}
            onChange={(e) => onEvidence(e.target.value)}
            placeholder="A moment or proof from today"
            className={`mt-3 w-full rounded-xl border bg-surface-elevated px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(false)}`}
          />
        </label>
      </div>
    </div>
  );
}
