"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import {
  validateMissionDraft,
  validateMissionStep,
} from "@/lib/missions/validate-mission";
import type { MissionBuilderStep, MissionDraft } from "@/types/mission";
import type { MissionFieldErrors } from "@/lib/missions/validate-mission";

const STEP_LABELS: Record<MissionBuilderStep, string> = {
  1: "Mission Name",
  2: "Purpose",
  3: "Success Criteria",
  4: "Status & Milestone",
};

type MissionBuilderProps = {
  mode: "create" | "edit";
  initialDraft: MissionDraft;
  onSave: (draft: MissionDraft) => void | Promise<void>;
  cancelHref?: string;
  successHref?: string;
  onComplete?: () => void;
  embedded?: boolean;
  sectionLabel?: string;
};

const EMPTY_ERRORS: MissionFieldErrors = {};

export function MissionBuilder({
  mode,
  initialDraft,
  onSave,
  cancelHref = "/mission",
  successHref = "/mission",
  onComplete,
  embedded = false,
  sectionLabel,
}: MissionBuilderProps) {
  const router = useRouter();
  const [step, setStep] = useState<MissionBuilderStep>(1);
  const [draft, setDraft] = useState<MissionDraft>(initialDraft);
  const [errors, setErrors] = useState<MissionFieldErrors>(EMPTY_ERRORS);
  const [summary, setSummary] = useState<string>();

  const stepLabel = STEP_LABELS[step];

  const reviewItems = useMemo(
    () => [
      { label: "Mission Name", value: draft.name },
      { label: "Purpose", value: draft.purpose },
      { label: "Success Criteria", value: draft.successCriteria },
      { label: "Mission Status", value: draft.missionStatus },
      { label: "Next Milestone", value: draft.nextMilestone },
    ],
    [draft]
  );

  function updateField<K extends keyof MissionDraft>(
    field: K,
    value: MissionDraft[K]
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
    setSummary(undefined);
  }

  function handleBack() {
    if (step === 1) {
      if (embedded) {
        return;
      }
      router.push(cancelHref);
      return;
    }

    setStep((current) => (current - 1) as MissionBuilderStep);
    setErrors(EMPTY_ERRORS);
    setSummary(undefined);
  }

  async function handleNext() {
    const result = validateMissionStep(step, draft);
    if (!result.isValid) {
      setErrors(result.errors);
      setSummary(result.summary);
      return;
    }

    if (step < 4) {
      setStep((current) => (current + 1) as MissionBuilderStep);
      setErrors(EMPTY_ERRORS);
      setSummary(undefined);
      return;
    }

    const finalResult = validateMissionDraft(draft);
    if (!finalResult.isValid) {
      setErrors(finalResult.errors);
      setSummary(finalResult.summary);
      return;
    }

    await onSave(draft);

    if (embedded) {
      onComplete?.();
      return;
    }

    router.push(successHref);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          {!embedded ? (
            <Link
              href={cancelHref}
              className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
            >
              ← Mission
            </Link>
          ) : null}
          <SectionLabel>
            {sectionLabel ??
              (mode === "create" ? "Create Mission" : "Edit Mission")}
          </SectionLabel>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Step {step} of 4
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {stepLabel}
          </h1>
        </header>

        <section className="mt-10 animate-fade-in [animation-delay:80ms]">
          {step === 1 ? (
            <label className="block" htmlFor="mission-name">
              <SectionLabel>Mission Name</SectionLabel>
              <input
                id="mission-name"
                type="text"
                value={draft.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Name the mission."
                aria-invalid={Boolean(errors.name)}
                className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.name))}`}
              />
              <ValidationMessage message={errors.name} />
            </label>
          ) : null}

          {step === 2 ? (
            <label className="block" htmlFor="mission-purpose">
              <SectionLabel>Purpose</SectionLabel>
              <textarea
                id="mission-purpose"
                value={draft.purpose}
                onChange={(event) => updateField("purpose", event.target.value)}
                rows={5}
                placeholder="Why does this mission matter?"
                aria-invalid={Boolean(errors.purpose)}
                className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.purpose))}`}
              />
              <ValidationMessage message={errors.purpose} />
            </label>
          ) : null}

          {step === 3 ? (
            <label className="block" htmlFor="mission-success-criteria">
              <SectionLabel>Success Criteria</SectionLabel>
              <textarea
                id="mission-success-criteria"
                value={draft.successCriteria}
                onChange={(event) =>
                  updateField("successCriteria", event.target.value)
                }
                rows={5}
                placeholder="How will you know this mission succeeded?"
                aria-invalid={Boolean(errors.successCriteria)}
                className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.successCriteria))}`}
              />
              <ValidationMessage message={errors.successCriteria} />
            </label>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <label className="block" htmlFor="mission-status">
                <SectionLabel>Mission Status</SectionLabel>
                <input
                  id="mission-status"
                  type="text"
                  value={draft.missionStatus}
                  onChange={(event) =>
                    updateField("missionStatus", event.target.value)
                  }
                  placeholder="e.g. Phase I — Foundation"
                  aria-invalid={Boolean(errors.missionStatus)}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.missionStatus))}`}
                />
                <ValidationMessage message={errors.missionStatus} />
              </label>

              <label className="block" htmlFor="mission-milestone">
                <SectionLabel>Next Milestone</SectionLabel>
                <input
                  id="mission-milestone"
                  type="text"
                  value={draft.nextMilestone}
                  onChange={(event) =>
                    updateField("nextMilestone", event.target.value)
                  }
                  placeholder="The next concrete step."
                  aria-invalid={Boolean(errors.nextMilestone)}
                  className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(errors.nextMilestone))}`}
                />
                <ValidationMessage message={errors.nextMilestone} />
              </label>

              <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
                <SectionLabel>Review</SectionLabel>
                <dl className="space-y-4">
                  {reviewItems.map((item) => (
                    <div key={item.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                        {item.label}
                      </dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-foreground/90">
                        {item.value.trim() || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <ValidationSummary message={summary} />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-14 flex-[1.4] items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16"
            >
              {step === 4 ? "Save Mission" : "Continue"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function createEmptyMissionDraft(): MissionDraft {
  return {
    name: "",
    purpose: "",
    successCriteria: "",
    missionStatus: "",
    nextMilestone: "",
  };
}

export function missionToDraft(
  mission: import("@/types/mission").Mission
): MissionDraft {
  return {
    name: mission.name,
    purpose: mission.purpose,
    successCriteria: mission.successCriteria,
    missionStatus: mission.missionStatus,
    nextMilestone: mission.nextMilestone,
  };
}
