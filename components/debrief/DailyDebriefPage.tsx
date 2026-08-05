"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DebriefCompleteStep } from "@/components/debrief/DebriefCompleteStep";
import { useProfile } from "@/context/ProfileContext";
import {
  createInitialDebriefState,
  serializeDebrief,
  type DebriefStep,
  type StandardAnswer,
} from "@/lib/debrief-form";
import {
  validateDebriefStep,
  type DebriefFieldErrors,
} from "@/lib/validate-debrief";
import { useApp } from "@/context/AppContext";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  cardErrorClass,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

function formatDate(): string {
  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

const STEP_LABELS: Record<DebriefStep, string> = {
  1: "Review My Standard",
  2: "Reflection",
  3: "Tomorrow",
  4: "Mission Complete",
};

function AnswerButton({
  label,
  selected,
  hasError,
  onClick,
}: {
  label: "Yes" | "No";
  selected: boolean;
  hasError: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex h-11 flex-1 items-center justify-center rounded-xl border text-sm font-medium transition-colors ${
        selected
          ? "border-accent/50 bg-accent-glow text-accent"
          : hasError
            ? "border-amber-500/40 bg-surface-elevated text-foreground/80 ring-1 ring-amber-500/10"
            : "border-border bg-surface-elevated text-foreground/80 hover:border-border-subtle"
      }`}
    >
      {label}
    </button>
  );
}

const EMPTY_ERRORS: DebriefFieldErrors = { standards: {} };

export function DailyDebriefPage() {
  const { standardStatements, isLoading: standardsLoading } = useProfile();
  const standards = standardStatements;

  if (standardsLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-muted">
        Loading your standard…
      </div>
    );
  }

  if (standards.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center text-muted">
        Add standards in Settings before completing a debrief.
      </div>
    );
  }

  return <DailyDebriefForm standards={standards} />;
}

function DailyDebriefForm({ standards }: { standards: string[] }) {
  const router = useRouter();
  const { completeDebrief, todaysCommitment } = useApp();
  const [step, setStep] = useState<DebriefStep>(1);
  const [standardIndex, setStandardIndex] = useState(0);
  const [form, setForm] = useState(() =>
    createInitialDebriefState(standards.length),
  );
  const [errors, setErrors] = useState<DebriefFieldErrors>(EMPTY_ERRORS);
  const [summary, setSummary] = useState<string>();
  const [completedOnePercent, setCompletedOnePercent] = useState("");

  const currentStandard = standards[standardIndex] ?? "";
  const currentEntry = form.standards[standardIndex];
  const currentStandardErrors = errors.standards[standardIndex];
  const hasAnswerError = Boolean(currentStandardErrors?.answer);

  function clearErrors() {
    setErrors(EMPTY_ERRORS);
    setSummary(undefined);
  }

  function setAnswer(index: number, answer: StandardAnswer) {
    setForm((current) => ({
      ...current,
      standards: current.standards.map((entry, i) => {
        if (i !== index) return entry;
        return { ...entry, answer: entry.answer === answer ? null : answer };
      }),
    }));

    if (errors.standards[index]?.answer) {
      setErrors((current) => {
        const next = { ...current, standards: { ...current.standards } };
        const standardErrors = { ...next.standards[index] };
        delete standardErrors.answer;
        if (Object.keys(standardErrors).length === 0) {
          delete next.standards[index];
        } else {
          next.standards[index] = standardErrors;
        }
        return next;
      });
    }
  }

  function setProof(index: number, evidence: string) {
    setForm((current) => ({
      ...current,
      standards: current.standards.map((entry, i) =>
        i === index ? { ...entry, evidence } : entry
      ),
    }));
  }

  function handleBack() {
    clearErrors();

    if (step === 1) {
      if (standardIndex > 0) {
        setStandardIndex((current) => current - 1);
        return;
      }

      router.push("/operations");
      return;
    }

    if (step === 2) {
      setStep(1);
      setStandardIndex(standards.length - 1);
      return;
    }

    if (step === 3) {
      setStep(2);
      return;
    }
  }

  function handleNext() {
    if (step === 1) {
      const result = validateDebriefStep(step, form, standardIndex);
      if (!result.isValid) {
        setErrors(result.errors);
        setSummary(result.summary);
        return;
      }

      clearErrors();

      if (standardIndex < standards.length - 1) {
        setStandardIndex((current) => current + 1);
        return;
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      const result = validateDebriefStep(step, form);
      if (!result.isValid) {
        setErrors(result.errors);
        setSummary(result.summary);
        return;
      }

      clearErrors();
      setStep(3);
      return;
    }

    if (step === 3) {
      const result = validateDebriefStep(step, form);
      if (!result.isValid) {
        setErrors(result.errors);
        setSummary(result.summary);
        return;
      }

      clearErrors();

      const completed = serializeDebrief(form, standards);
      void completeDebrief(completed).then(() => {
        setCompletedOnePercent(completed.tomorrowOnePercent);
        setStep(4);
      });
      return;
    }
  }

  const showFooter = step < 4;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="mb-10 animate-fade-in">
          <SectionLabel>Daily Debrief</SectionLabel>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Step {step} of 4 · {STEP_LABELS[step]}
          </p>
          {step < 4 ? (
            <time
              dateTime={new Date().toISOString().split("T")[0]}
              className="mt-2 block text-[15px] text-muted"
            >
              {formatDate()}
            </time>
          ) : null}
        </header>

        {step === 1 ? (
          <section className="animate-fade-in [animation-delay:60ms]">
            <SectionLabel>My Standard</SectionLabel>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Standard {standardIndex + 1} of {standards.length}
            </p>

            <article
              id={`standard-${standardIndex}`}
              className={`rounded-2xl border bg-surface p-5 sm:p-6 ${cardErrorClass(hasAnswerError)}`}
            >
              <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
                {currentStandard}
              </p>

              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Did I live this today?
              </p>

              <div
                id={`standard-${standardIndex}-answer`}
                className="mt-3 flex gap-2"
              >
                <AnswerButton
                  label="Yes"
                  selected={currentEntry.answer === "yes"}
                  hasError={hasAnswerError}
                  onClick={() => setAnswer(standardIndex, "yes")}
                />
                <AnswerButton
                  label="No"
                  selected={currentEntry.answer === "no"}
                  hasError={hasAnswerError}
                  onClick={() => setAnswer(standardIndex, "no")}
                />
              </div>
              <ValidationMessage message={currentStandardErrors?.answer} />

              <label className="mt-4 block">
                <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Proof (optional)
                </span>
                <input
                  id={`standard-${standardIndex}-evidence`}
                  type="text"
                  value={currentEntry.evidence}
                  onChange={(event) =>
                    setProof(standardIndex, event.target.value)
                  }
                  placeholder="Proof"
                  className={`w-full rounded-xl border bg-surface-elevated px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(false)}`}
                />
              </label>
            </article>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="space-y-6 animate-fade-in [animation-delay:60ms]">
            <div>
              <label className="block" htmlFor="field-biggestWin">
                <SectionLabel>Biggest Win</SectionLabel>
                <input
                  id="field-biggestWin"
                  type="text"
                  value={form.biggestWin}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      biggestWin: event.target.value,
                    }));
                    if (errors.biggestWin && event.target.value.trim()) {
                      setErrors((current) => ({
                        ...current,
                        biggestWin: undefined,
                      }));
                    }
                  }}
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
                  value={form.biggestLesson}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      biggestLesson: event.target.value,
                    }));
                    if (errors.biggestLesson && event.target.value.trim()) {
                      setErrors((current) => ({
                        ...current,
                        biggestLesson: undefined,
                      }));
                    }
                  }}
                  placeholder="Name it."
                  aria-invalid={Boolean(errors.biggestLesson)}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.biggestLesson))}`}
                />
              </label>
              <ValidationMessage message={errors.biggestLesson} />
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="space-y-6 animate-fade-in [animation-delay:60ms]">
            <div>
              <label className="block" htmlFor="field-tomorrowOnePercent">
                <SectionLabel>Tomorrow&apos;s 1%</SectionLabel>
                <input
                  id="field-tomorrowOnePercent"
                  type="text"
                  value={form.tomorrowOnePercent}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      tomorrowOnePercent: event.target.value,
                    }));
                    if (errors.tomorrowOnePercent && event.target.value.trim()) {
                      setErrors((current) => ({
                        ...current,
                        tomorrowOnePercent: undefined,
                      }));
                    }
                  }}
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
                  value={form.tomorrowPriority}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      tomorrowPriority: event.target.value,
                    }));
                    if (errors.tomorrowPriority && event.target.value.trim()) {
                      setErrors((current) => ({
                        ...current,
                        tomorrowPriority: undefined,
                      }));
                    }
                  }}
                  placeholder="The one thing that matters most."
                  aria-invalid={Boolean(errors.tomorrowPriority)}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.tomorrowPriority))}`}
                />
              </label>
              <ValidationMessage message={errors.tomorrowPriority} />
            </div>

            <div>
              <label className="block" htmlFor="field-courseCorrection">
                <SectionLabel>Course Correction</SectionLabel>
                <input
                  id="field-courseCorrection"
                  type="text"
                  value={form.courseCorrection}
                  onChange={(event) => {
                    setForm((current) => ({
                      ...current,
                      courseCorrection: event.target.value,
                    }));
                    if (errors.courseCorrection && event.target.value.trim()) {
                      setErrors((current) => ({
                        ...current,
                        courseCorrection: undefined,
                      }));
                    }
                  }}
                  placeholder="What needs to change tomorrow?"
                  aria-invalid={Boolean(errors.courseCorrection)}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.courseCorrection))}`}
                />
              </label>
              <ValidationMessage message={errors.courseCorrection} />
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <DebriefCompleteStep
            todaysCommitment={todaysCommitment}
            tomorrowsOnePercent={completedOnePercent}
          />
        ) : null}
      </main>

      {showFooter ? (
        <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
            <ValidationSummary message={summary} />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
              >
                {step === 1 && standardIndex === 0 ? "Cancel" : "Back"}
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-14 flex-[1.4] items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
              >
                Next
              </button>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
