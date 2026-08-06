"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getInitialSuggestion,
  getRandomSuggestion,
} from "@/lib/mission-intent-suggestions";
import { validateMissionIntent } from "@/lib/validate-mission-intent";
import type { MissionIntentFieldErrors } from "@/lib/validate-mission-intent";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  cardErrorClass,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

type Mode = "suggest" | "custom";

export function MissionIntentPage() {
  const router = useRouter();
  const { setTodaysMissionIntent } = useTrueNorth();

  const [mode, setMode] = useState<Mode>("suggest");
  const [suggestion, setSuggestion] = useState(getInitialSuggestion);
  const [customText, setCustomText] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [errors, setErrors] = useState<MissionIntentFieldErrors>({});
  const [summary, setSummary] = useState<string>();

  function clearErrors() {
    setErrors({});
    setSummary(undefined);
  }

  function handleUseThis() {
    setIsSelected(true);
    setMode("suggest");
    clearErrors();
  }

  function handleSuggestAnother() {
    setSuggestion((current) => getRandomSuggestion(current));
    setIsSelected(false);
    setMode("suggest");
    clearErrors();
  }

  function handleWriteMyOwn() {
    setMode("custom");
    setIsSelected(false);
    clearErrors();
    if (!customText) {
      setCustomText("Today I will ");
    }
  }

  function handleBeginMission() {
    const result = validateMissionIntent({
      mode,
      suggestion,
      customText,
      isSelected,
    });

    if (!result.isValid) {
      setErrors(result.errors);
      setSummary(result.summary);
      return;
    }

    clearErrors();

    const finalCommitment =
      mode === "custom" ? customText.trim() : suggestion.trim();

    void setTodaysMissionIntent({
      commitment: finalCommitment,
      source: mode === "custom" ? "custom" : "suggested",
      createdAt: new Date().toISOString(),
    });
    router.push("/operations");
  }

  const commitmentError = errors.commitment;
  const showSuggestError = mode === "suggest" && Boolean(commitmentError);
  const showCustomError = mode === "custom" && Boolean(commitmentError);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-8 pt-16 sm:max-w-xl sm:px-8 sm:pt-20 lg:max-w-2xl lg:pt-24">
        <header className="animate-fade-in text-center">
          <SectionLabel>Mission Intent</SectionLabel>
          <p className="mt-3 text-[17px] leading-relaxed text-muted sm:text-lg">
            Who will you choose to be today?
          </p>
        </header>

        <div className="mt-12 animate-fade-in [animation-delay:80ms] sm:mt-14">
          {mode === "suggest" ? (
            <div
              id="field-commitment"
              className={`rounded-2xl border px-6 py-8 transition-colors sm:px-8 sm:py-10 ${cardErrorClass(showSuggestError)} ${
                isSelected && !showSuggestError
                  ? "border-accent/50 bg-accent-glow"
                  : !showSuggestError
                    ? "bg-surface"
                    : "bg-surface"
              }`}
            >
              <p className="text-center text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
                {suggestion}
              </p>
              <ValidationMessage message={showSuggestError ? commitmentError : undefined} />
            </div>
          ) : (
            <div id="field-commitment">
              <textarea
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  if (errors.commitment) clearErrors();
                }}
                placeholder="Today I will..."
                rows={4}
                autoFocus
                aria-invalid={showCustomError}
                aria-describedby={showCustomError ? "commitment-error" : undefined}
                className={`w-full resize-none rounded-2xl border bg-surface px-5 py-4 text-[17px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none sm:text-base ${fieldErrorClass(showCustomError)}`}
              />
              <ValidationMessage
                id="commitment-error"
                message={showCustomError ? commitmentError : undefined}
              />
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3 animate-fade-in [animation-delay:160ms] sm:mt-10">
          {mode === "suggest" && (
            <button
              type="button"
              onClick={handleUseThis}
              className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-colors sm:h-14 sm:text-[15px] ${
                isSelected
                  ? "border-accent/50 bg-accent-glow text-accent"
                  : "border-border bg-surface text-foreground hover:border-border-subtle"
              }`}
            >
              <span aria-hidden>✓</span>
              Use This
            </button>
          )}

          {mode === "suggest" && (
            <button
              type="button"
              onClick={handleSuggestAnother}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface text-sm font-medium text-foreground transition-colors hover:border-border-subtle sm:h-14 sm:text-[15px]"
            >
              <span aria-hidden>🔄</span>
              Suggest Another
            </button>
          )}

          <button
            type="button"
            onClick={handleWriteMyOwn}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl border text-sm font-medium transition-colors sm:h-14 sm:text-[15px] ${
              mode === "custom"
                ? "border-accent/50 bg-accent-glow text-accent"
                : "border-border bg-surface text-foreground hover:border-border-subtle"
            }`}
          >
            <span aria-hidden>✏️</span>
            Write My Own
          </button>
        </div>
      </main>

      <footer className="animate-fade-in px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 [animation-delay:240ms] sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <ValidationSummary message={summary} />
          <button
            type="button"
            onClick={handleBeginMission}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
          >
            Begin Mission
          </button>
        </div>
      </footer>
    </div>
  );
}
