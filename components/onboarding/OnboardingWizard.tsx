"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MissionBuilder,
  createEmptyMissionDraft,
} from "@/components/mission/MissionBuilder";
import {
  isValidStandardsCount,
  StandardsEditor,
} from "@/components/standards/StandardsEditor";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useApp } from "@/context/AppContext";
import { useProfile } from "@/context/ProfileContext";
import {
  getInitialSuggestion,
  getRandomSuggestion,
} from "@/lib/mission-intent-suggestions";
import { validateMissionIntent } from "@/lib/validate-mission-intent";
import {
  ValidationMessage,
  ValidationSummary,
  cardErrorClass,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

type OnboardingStep = 1 | 2 | 3 | 4 | 5;

export function OnboardingWizard() {
  const router = useRouter();
  const { saveStandards, finishOnboarding } = useProfile();
  const { createActiveMission, completeMorningCommit } = useApp();

  const [step, setStep] = useState<OnboardingStep>(1);
  const [standards, setStandards] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  const [suggestion, setSuggestion] = useState(getInitialSuggestion);
  const [customText, setCustomText] = useState("");
  const [intentMode, setIntentMode] = useState<"suggest" | "custom">("suggest");
  const [intentSelected, setIntentSelected] = useState(false);
  const [intentErrors, setIntentErrors] = useState<{ commitment?: string }>(
    {},
  );
  const [intentSummary, setIntentSummary] = useState<string>();

  async function handleStandardsContinue() {
    if (!isValidStandardsCount(standards.length)) {
      setError(`Choose between 5 and 8 standards.`);
      return;
    }

    setSaving(true);
    setError(undefined);
    const ok = await saveStandards(standards);
    setSaving(false);

    if (!ok) {
      setError("Unable to save your standards. Try again.");
      return;
    }

    setStep(3);
  }

  async function handleFinish() {
    setSaving(true);
    setError(undefined);
    const ok = await finishOnboarding();
    setSaving(false);

    if (!ok) {
      setError("Unable to complete onboarding. Try again.");
      return;
    }

    router.replace("/");
    router.refresh();
  }

  async function handleIntentContinue() {
    const result = validateMissionIntent({
      mode: intentMode,
      suggestion,
      customText,
      isSelected: intentSelected,
    });

    if (!result.isValid) {
      setIntentErrors(result.errors);
      setIntentSummary(result.summary);
      return;
    }

    const commitment =
      intentMode === "custom" ? customText.trim() : suggestion.trim();

    setSaving(true);
    await completeMorningCommit(commitment);
    setSaving(false);
    setStep(5);
  }

  if (step === 3) {
    return (
      <MissionBuilder
        mode="create"
        embedded
        sectionLabel="Current Mission"
        initialDraft={createEmptyMissionDraft()}
        onSave={(draft) => createActiveMission(draft)}
        onComplete={() => setStep(4)}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-12 sm:max-w-xl sm:px-8 sm:pt-16">
        {step === 1 ? (
          <section className="animate-fade-in">
            <SectionLabel>Welcome</SectionLabel>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to True North.
            </h1>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">
              This is your personal operating system.
            </p>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              You are not creating goals. You are defining the standard you
              intend to live by.
            </p>
          </section>
        ) : null}

        {step === 2 ? (
          <section className="animate-fade-in">
            <StandardsEditor
              initialStandards={standards}
              onChange={setStandards}
            />
            {error ? (
              <p className="mt-4 text-[14px] text-red-300/90">{error}</p>
            ) : null}
          </section>
        ) : null}

        {step === 4 ? (
          <section className="animate-fade-in text-center">
            <SectionLabel>Mission Intent</SectionLabel>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">
              Who will you choose to be today?
            </p>

            <div className="mt-10 text-left">
              {intentMode === "suggest" ? (
                <div
                  className={`rounded-2xl border px-6 py-8 ${cardErrorClass(Boolean(intentErrors.commitment))} ${
                    intentSelected
                      ? "border-accent/50 bg-accent-glow"
                      : "border-border bg-surface"
                  }`}
                >
                  <p className="text-center text-[17px] leading-relaxed text-foreground/90">
                    {suggestion}
                  </p>
                  <ValidationMessage message={intentErrors.commitment} />
                </div>
              ) : (
                <textarea
                  value={customText}
                  onChange={(event) => {
                    setCustomText(event.target.value);
                    setIntentErrors({});
                  }}
                  placeholder="Today I will..."
                  rows={4}
                  className={`w-full resize-none rounded-2xl border bg-surface px-5 py-4 text-[17px] leading-relaxed text-foreground outline-none ${fieldErrorClass(Boolean(intentErrors.commitment))}`}
                />
              )}

              <div className="mt-4 space-y-2">
                {intentMode === "suggest" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIntentSelected(true);
                        setIntentErrors({});
                      }}
                      className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-medium"
                    >
                      Use This
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSuggestion((current) => getRandomSuggestion(current));
                        setIntentSelected(false);
                      }}
                      className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-medium"
                    >
                      Suggest Another
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setIntentMode(intentMode === "custom" ? "suggest" : "custom");
                    setIntentSelected(false);
                    if (!customText) {
                      setCustomText("Today I will ");
                    }
                  }}
                  className="flex h-12 w-full items-center justify-center rounded-2xl border border-border bg-surface text-sm font-medium"
                >
                  {intentMode === "custom" ? "Use Suggestion" : "Write My Own"}
                </button>
              </div>

              <ValidationSummary message={intentSummary} />
            </div>
          </section>
        ) : null}

        {step === 5 ? (
          <section className="animate-fade-in text-center">
            <SectionLabel>Complete</SectionLabel>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              You now have your True North.
            </h1>
            {error ? (
              <p className="mt-4 text-[14px] text-red-300/90">{error}</p>
            ) : null}
          </section>
        ) : null}
      </main>

      <footer className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl">
          {step === 1 ? (
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.16em] text-white"
            >
              Continue
            </button>
          ) : null}

          {step === 2 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleStandardsContinue()}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.16em] text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Continue"}
            </button>
          ) : null}

          {step === 4 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleIntentContinue()}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.16em] text-white disabled:opacity-50"
            >
              {saving ? "Saving…" : "Continue"}
            </button>
          ) : null}

          {step === 5 ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleFinish()}
              className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.16em] text-white disabled:opacity-50"
            >
              {saving ? "Finishing…" : "Continue to Dashboard"}
            </button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
