"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { theCode } from "@/lib/placeholder-data";
import {
  createInitialDebriefState,
  serializeDebrief,
  type StandardAnswer,
} from "@/lib/debrief-form";
import {
  getFirstDebriefErrorId,
  validateDebrief,
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
  const router = useRouter();
  const { completeDebrief } = useApp();
  const [form, setForm] = useState(() =>
    createInitialDebriefState(theCode.length)
  );
  const [errors, setErrors] = useState<DebriefFieldErrors>(EMPTY_ERRORS);
  const [summary, setSummary] = useState<string>();

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

  function setEvidence(index: number, evidence: string) {
    setForm((current) => ({
      ...current,
      standards: current.standards.map((entry, i) =>
        i === index ? { ...entry, evidence } : entry
      ),
    }));

    if (errors.standards[index]?.evidence && evidence.trim()) {
      setErrors((current) => {
        const next = { ...current, standards: { ...current.standards } };
        const standardErrors = { ...next.standards[index] };
        delete standardErrors.evidence;
        if (Object.keys(standardErrors).length === 0) {
          delete next.standards[index];
        } else {
          next.standards[index] = standardErrors;
        }
        return next;
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = validateDebrief(form);

    if (!result.isValid) {
      setErrors(result.errors);
      setSummary(result.summary);

      const firstErrorId = getFirstDebriefErrorId(result.errors, theCode.length);
      if (firstErrorId) {
        document.getElementById(firstErrorId)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return;
    }

    clearErrors();

    const completed = serializeDebrief(form, theCode);
    console.log("Daily Debrief — completed values:", completed);

    completeDebrief(completed);

    router.push("/mission-complete");
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-dvh flex-1 flex-col"
        noValidate
      >
        <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
          <header className="mb-10 animate-fade-in">
            <SectionLabel>Daily Debrief</SectionLabel>
            <time
              dateTime={new Date().toISOString().split("T")[0]}
              className="mt-2 block text-[15px] text-muted"
            >
              {formatDate()}
            </time>
          </header>

          <section className="space-y-5 animate-fade-in [animation-delay:60ms]">
            <SectionLabel>My Standard</SectionLabel>

            {theCode.map((statement, index) => {
              const entry = form.standards[index];
              const standardErrors = errors.standards[index];
              const hasAnswerError = Boolean(standardErrors?.answer);
              const hasEvidenceError = Boolean(standardErrors?.evidence);
              const hasCardError = hasAnswerError || hasEvidenceError;

              return (
                <article
                  key={statement}
                  id={`standard-${index}`}
                  className={`rounded-2xl border bg-surface p-5 sm:p-6 ${cardErrorClass(hasCardError)}`}
                >
                  <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
                    {statement}
                  </p>

                  <div
                    id={`standard-${index}-answer`}
                    className="mt-4 flex gap-2"
                  >
                    <AnswerButton
                      label="Yes"
                      selected={entry.answer === "yes"}
                      hasError={hasAnswerError}
                      onClick={() => setAnswer(index, "yes")}
                    />
                    <AnswerButton
                      label="No"
                      selected={entry.answer === "no"}
                      hasError={hasAnswerError}
                      onClick={() => setAnswer(index, "no")}
                    />
                  </div>
                  <ValidationMessage message={standardErrors?.answer} />

                  <label className="mt-4 block">
                    <span className="sr-only">Evidence for {statement}</span>
                    <input
                      id={`standard-${index}-evidence`}
                      type="text"
                      value={entry.evidence}
                      onChange={(e) => setEvidence(index, e.target.value)}
                      placeholder="Evidence"
                      aria-invalid={hasEvidenceError}
                      className={`w-full rounded-xl border bg-surface-elevated px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(hasEvidenceError)}`}
                    />
                  </label>
                  <ValidationMessage message={standardErrors?.evidence} />
                </article>
              );
            })}
          </section>

          <section className="mt-12 space-y-6 border-t border-border pt-12 animate-fade-in [animation-delay:120ms]">
            <div>
              <label className="block" htmlFor="field-biggestWin">
                <SectionLabel>Today&apos;s Biggest Win</SectionLabel>
                <input
                  id="field-biggestWin"
                  type="text"
                  value={form.biggestWin}
                  onChange={(e) => {
                    setForm((current) => ({
                      ...current,
                      biggestWin: e.target.value,
                    }));
                    if (errors.biggestWin && e.target.value.trim()) {
                      setErrors((current) => ({ ...current, biggestWin: undefined }));
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
                <SectionLabel>Today&apos;s Biggest Lesson</SectionLabel>
                <input
                  id="field-biggestLesson"
                  type="text"
                  value={form.biggestLesson}
                  onChange={(e) => {
                    setForm((current) => ({
                      ...current,
                      biggestLesson: e.target.value,
                    }));
                    if (errors.biggestLesson && e.target.value.trim()) {
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

            <div>
              <label className="block" htmlFor="field-tomorrowOnePercent">
                <SectionLabel>Tomorrow&apos;s 1%</SectionLabel>
                <input
                  id="field-tomorrowOnePercent"
                  type="text"
                  value={form.tomorrowOnePercent}
                  onChange={(e) => {
                    setForm((current) => ({
                      ...current,
                      tomorrowOnePercent: e.target.value,
                    }));
                    if (errors.tomorrowOnePercent && e.target.value.trim()) {
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
          </section>
        </main>

        <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
            <ValidationSummary message={summary} />
            <button
              type="submit"
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
            >
              Finish Mission
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
