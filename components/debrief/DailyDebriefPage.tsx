"use client";

import { useEffect, useState } from "react";
import {
  createInitialDebriefDraft,
  serializeDebrief,
} from "@/lib/debrief-form";
import {
  validateStep1Standard,
  validateStep2,
  validateStep3,
  type Step1Errors,
  type Step2Errors,
  type Step3Errors,
} from "@/lib/validate-debrief";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionLabel } from "@/components/ui/SectionCard";
import { DebriefProgress } from "@/components/debrief/DebriefProgress";
import { StepStandardReview } from "@/components/debrief/StepStandardReview";
import { StepReflection } from "@/components/debrief/StepReflection";
import { StepTomorrow } from "@/components/debrief/StepTomorrow";
import { StepMissionComplete } from "@/components/debrief/StepMissionComplete";

function formatDate(): string {
  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function DailyDebriefPage() {
  const {
    myStandard,
    dailyDebrief,
    setDailyDebriefDraft,
    updateDailyDebriefDraft,
    setDailyDebriefSubmission,
    setTodaysOnePercent,
  } = useTrueNorth();

  const debriefDraft = dailyDebrief.draft;

  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});
  const [step2Errors, setStep2Errors] = useState<Step2Errors>({});
  const [step2Summary, setStep2Summary] = useState<string>();
  const [step3Errors, setStep3Errors] = useState<Step3Errors>({});
  const [step3Summary, setStep3Summary] = useState<string>();

  useEffect(() => {
    if (!debriefDraft) {
      setDailyDebriefDraft(createInitialDebriefDraft(myStandard.length));
    }
  }, [debriefDraft, myStandard.length, setDailyDebriefDraft]);

  if (!debriefDraft) {
    return null;
  }

  const draft = debriefDraft;

  function setStandardAnswer(index: number, answer: "yes" | "no") {
    updateDailyDebriefDraft({
      standards: draft.standards.map((entry, i) =>
        i === index
          ? {
              ...entry,
              answer,
              evidence: answer === "no" ? "" : entry.evidence,
            }
          : entry
      ),
    });
    setStep1Errors({});
  }

  function setStandardEvidence(index: number, evidence: string) {
    updateDailyDebriefDraft({
      standards: draft.standards.map((entry, i) =>
        i === index ? { ...entry, evidence } : entry
      ),
    });
    if (step1Errors.evidence) {
      setStep1Errors((current) => ({ ...current, evidence: undefined }));
    }
  }

  function handleStep1Continue() {
    const result = validateStep1Standard(draft);
    if (!result.isValid) {
      setStep1Errors(result.errors);
      return;
    }

    setStep1Errors({});

    if (draft.standardIndex < myStandard.length - 1) {
      updateDailyDebriefDraft({ standardIndex: draft.standardIndex + 1 });
      return;
    }

    updateDailyDebriefDraft({ step: 2 });
  }

  function handleStep1Back() {
    if (draft.standardIndex > 0) {
      updateDailyDebriefDraft({ standardIndex: draft.standardIndex - 1 });
      setStep1Errors({});
    }
  }

  function handleStep2Continue() {
    const result = validateStep2(draft);
    if (!result.isValid) {
      setStep2Errors(result.errors);
      setStep2Summary(result.summary);
      return;
    }

    setStep2Errors({});
    setStep2Summary(undefined);
    updateDailyDebriefDraft({ step: 3 });
  }

  function handleStep2Back() {
    setStep2Errors({});
    setStep2Summary(undefined);
    updateDailyDebriefDraft({ step: 1, standardIndex: myStandard.length - 1 });
  }

  function handleStep3Continue() {
    const result = validateStep3(draft);
    if (!result.isValid) {
      setStep3Errors(result.errors);
      setStep3Summary(result.summary);
      return;
    }

    setStep3Errors({});
    setStep3Summary(undefined);

    const submission = serializeDebrief(draft, myStandard);
    setDailyDebriefSubmission(submission);
    setTodaysOnePercent({
      improvement: draft.tomorrowOnePercent.trim(),
      setAt: new Date().toISOString(),
      source: "debrief",
    });
    updateDailyDebriefDraft({ step: 4 });
  }

  function handleStep3Back() {
    setStep3Errors({});
    setStep3Summary(undefined);
    updateDailyDebriefDraft({ step: 2 });
  }

  function handleReturnHome() {
    const submission = serializeDebrief(draft, myStandard);
    setDailyDebriefSubmission(submission);
    setTodaysOnePercent({
      improvement: draft.tomorrowOnePercent.trim(),
      setAt: new Date().toISOString(),
      source: "debrief",
    });
    setDailyDebriefDraft(null);
  }

  const showNav = draft.step < 4;
  const standardsHonoured = draft.standards.filter(
    (entry) => entry.answer === "yes"
  ).length;
  const evidenceCount = draft.standards.filter(
    (entry) => entry.answer === "yes" && entry.evidence.trim()
  ).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        {debriefDraft.step < 4 ? (
          <header className="mb-10">
            <SectionLabel>Daily Debrief</SectionLabel>
            <time
              dateTime={new Date().toISOString().split("T")[0]}
              className="mt-2 block text-[15px] text-muted"
            >
              {formatDate()}
            </time>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Am I becoming the person I committed to be?
            </p>
            <div className="mt-6">
              <DebriefProgress step={debriefDraft.step} />
            </div>
          </header>
        ) : null}

        {debriefDraft.step === 1 && (
          <StepStandardReview
            draft={debriefDraft}
            statement={myStandard[debriefDraft.standardIndex]?.statement ?? ""}
            standardTotal={myStandard.length}
            errors={step1Errors}
            onAnswer={(answer) =>
              setStandardAnswer(debriefDraft.standardIndex, answer)
            }
            onEvidence={(evidence) =>
              setStandardEvidence(debriefDraft.standardIndex, evidence)
            }
          />
        )}

        {debriefDraft.step === 2 && (
          <StepReflection
            draft={debriefDraft}
            errors={step2Errors}
            summary={step2Summary}
            onChange={(field, value) => {
              updateDailyDebriefDraft({ [field]: value });
              if (step2Errors[field]) {
                setStep2Errors((current) => ({ ...current, [field]: undefined }));
              }
            }}
          />
        )}

        {debriefDraft.step === 3 && (
          <StepTomorrow
            draft={debriefDraft}
            errors={step3Errors}
            summary={step3Summary}
            onChange={(field, value) => {
              updateDailyDebriefDraft({ [field]: value });
              if (
                field !== "courseCorrection" &&
                step3Errors[field as keyof Step3Errors]
              ) {
                setStep3Errors((current) => ({ ...current, [field]: undefined }));
              }
            }}
          />
        )}

        {debriefDraft.step === 4 && (
          <StepMissionComplete
            evidenceCount={evidenceCount}
            standardsHonoured={standardsHonoured}
            onReturnHome={handleReturnHome}
          />
        )}
      </main>

      {showNav && (
        <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex w-full max-w-lg gap-3 sm:max-w-xl lg:max-w-2xl">
            {debriefDraft.step === 1 && debriefDraft.standardIndex > 0 && (
              <button
                type="button"
                onClick={handleStep1Back}
                className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
              >
                Back
              </button>
            )}

            {(debriefDraft.step === 2 || debriefDraft.step === 3) && (
              <button
                type="button"
                onClick={
                  debriefDraft.step === 2 ? handleStep2Back : handleStep3Back
                }
                className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={
                debriefDraft.step === 1
                  ? handleStep1Continue
                  : debriefDraft.step === 2
                    ? handleStep2Continue
                    : handleStep3Continue
              }
              className="flex h-14 flex-[2] items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:h-16"
            >
              Continue
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
