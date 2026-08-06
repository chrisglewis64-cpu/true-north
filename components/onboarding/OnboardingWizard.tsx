"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import {
  StandardsEditor,
  type EditableStandard,
} from "@/components/onboarding/StandardsEditor";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { POST_AUTH_REDIRECT, SIGN_IN_PATH } from "@/lib/auth/paths";
import { DEFAULT_MISSION_STATUS } from "@/lib/mission-status";
import {
  MAX_STANDARDS,
  MIN_STANDARDS,
  MISSION_CATEGORIES,
  ONBOARDING_EXAMPLE_STANDARDS,
} from "@/lib/onboarding/example-standards";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { MissionIntent } from "@/types/mission-intent";

function createEditableStandards(
  statements: readonly string[]
): EditableStandard[] {
  return statements.map((statement, index) => ({
    key: `example-${index + 1}`,
    statement,
  }));
}

export function OnboardingWizard() {
  const router = useRouter();
  const {
    session,
    myStandard,
    currentMission,
    hasCompletedOnboarding,
    setMyStandard,
    createMission,
    setTodaysMissionIntent,
    markOnboardingComplete,
  } = useTrueNorth();

  const [step, setStep] = useState(1);
  const [standards, setStandards] = useState<EditableStandard[]>(() =>
    createEditableStandards(ONBOARDING_EXAMPLE_STANDARDS)
  );
  const [standardsSeeded, setStandardsSeeded] = useState(false);
  const [standardsError, setStandardsError] = useState<string>();
  const [missionTitle, setMissionTitle] = useState("");
  const [missionDescription, setMissionDescription] = useState("");
  const [missionCategory, setMissionCategory] = useState<string>(
    MISSION_CATEGORIES[0]
  );
  const [missionError, setMissionError] = useState<string>();
  const [intent, setIntent] = useState("");
  const [intentError, setIntentError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createSupabaseBrowserClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(SIGN_IN_PATH);
        return;
      }
      if (hasCompletedOnboarding) {
        router.replace(POST_AUTH_REDIRECT);
      }
    });
  }, [hasCompletedOnboarding, router]);

  useEffect(() => {
    if (standardsSeeded || myStandard.length === 0) {
      return;
    }

    setStandards(
      myStandard.map((standard) => ({
        key: standard.id,
        statement: standard.statement,
      }))
    );
    setStandardsSeeded(true);
  }, [myStandard, standardsSeeded]);

  const displayStandards = useMemo(() => {
    if (myStandard.length > 0) {
      return myStandard;
    }
    return standards
      .filter((item) => item.statement.trim())
      .map((item, index) => ({
        id: item.key,
        order: index + 1,
        statement: item.statement.trim(),
      }));
  }, [myStandard, standards]);

  async function saveStandardsAndContinue() {
    const cleaned = standards
      .map((item) => ({ ...item, statement: item.statement.trim() }))
      .filter((item) => item.statement.length > 0);

    if (cleaned.length < MIN_STANDARDS) {
      setStandardsError(`Create at least ${MIN_STANDARDS} standards.`);
      return;
    }
    if (cleaned.length > MAX_STANDARDS) {
      setStandardsError(`Keep your Standard to ${MAX_STANDARDS} or fewer.`);
      return;
    }

    setStandardsError(undefined);
    setSubmitting(true);

    try {
      await setMyStandard(
        cleaned.map((item, index) => ({
          id: item.key,
          order: index + 1,
          statement: item.statement,
        }))
      );
      setStep(3);
    } catch {
      setStandardsError("Unable to save your standards. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveMissionAndContinue() {
    if (!missionTitle.trim() || !missionDescription.trim() || !missionCategory) {
      setMissionError("Title, description, and category are required.");
      return;
    }

    setMissionError(undefined);
    setSubmitting(true);

    try {
      await createMission({
        name: missionTitle.trim(),
        purpose: missionDescription.trim(),
        category: missionCategory,
        whyThisMatters: missionDescription.trim(),
        successCriteria: "",
        currentProgress: "Just started",
        nextMilestone: "Take the first intentional action.",
        missionStatus: DEFAULT_MISSION_STATUS,
      });
      setStep(4);
    } catch {
      setMissionError("Unable to save your mission. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function commitAndFinish() {
    if (!intent.trim()) {
      setIntentError("Set today's intent before you commit.");
      return;
    }

    setIntentError(undefined);
    setSubmitting(true);

    const commitment: MissionIntent = {
      commitment: intent.trim(),
      source: "custom",
      createdAt: new Date().toISOString(),
    };

    try {
      await setTodaysMissionIntent(commitment);
      await markOnboardingComplete();
      router.replace(POST_AUTH_REDIRECT);
      router.refresh();
    } catch {
      setIntentError("Unable to complete setup. Try again.");
      setSubmitting(false);
    }
  }

  if (step === 1) {
    return (
      <OnboardingShell step={1} totalSteps={4} title="Define your Standard.">
        <div className="space-y-5 text-[17px] leading-relaxed text-muted">
          <p>
            Standards are the principles you live by. They rarely change.
          </p>
          <p>
            Everything in True North — mission, bearings, evidence — serves
            this identity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setStep(2)}
          className="mt-10 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
        >
          Continue
        </button>
      </OnboardingShell>
    );
  }

  if (step === 2) {
    return (
      <OnboardingShell
        step={2}
        totalSteps={4}
        title="Create Your Standards."
        subtitle="Define 5–8 personal standards. These become My Standard — unique to you."
      >
        <StandardsEditor
          standards={standards}
          onChange={setStandards}
          error={standardsError}
        />
        <button
          type="button"
          disabled={submitting}
          onClick={() => void saveStandardsAndContinue()}
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
        >
          {submitting ? "Saving…" : "Continue"}
        </button>
      </OnboardingShell>
    );
  }

  if (step === 3) {
    return (
      <OnboardingShell
        step={3}
        totalSteps={4}
        title="Create Your Current Mission."
        subtitle="A season of focused effort tied to who you are becoming."
      >
        <ValidationSummary message={missionError} />
        <div className="space-y-5">
          <label className="block" htmlFor="onboarding-mission-title">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Mission Title
            </span>
            <input
              id="onboarding-mission-title"
              value={missionTitle}
              onChange={(event) => setMissionTitle(event.target.value)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground focus:outline-none ${fieldErrorClass(false)}`}
              placeholder="Lead my family with integrity"
            />
          </label>

          <label className="block" htmlFor="onboarding-mission-description">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Mission Description
            </span>
            <textarea
              id="onboarding-mission-description"
              value={missionDescription}
              onChange={(event) => setMissionDescription(event.target.value)}
              rows={4}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground focus:outline-none ${fieldErrorClass(false)}`}
              placeholder="What this season is for."
            />
          </label>

          <label className="block" htmlFor="onboarding-mission-category">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Mission Category
            </span>
            <select
              id="onboarding-mission-category"
              value={missionCategory}
              onChange={(event) => setMissionCategory(event.target.value)}
              className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground focus:outline-none ${fieldErrorClass(false)}`}
            >
              {MISSION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={() => void saveMissionAndContinue()}
          className="mt-8 flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
        >
          {submitting ? "Saving…" : "Continue"}
        </button>
      </OnboardingShell>
    );
  }

  const missionName = currentMission?.name || missionTitle.trim();
  const missionPurpose = currentMission?.purpose || missionDescription.trim();

  return (
    <OnboardingShell
      step={4}
      totalSteps={4}
      title="Who are you today?"
      subtitle="Today is another opportunity to live your standard."
    >
      <div className="space-y-8">
        <SectionCard>
          <SectionLabel>My Standard</SectionLabel>
          <ul className="space-y-4">
            {displayStandards.map((principle) => (
              <li
                key={principle.id}
                className="flex gap-3 text-[15px] leading-relaxed text-foreground/90"
              >
                <span className="shrink-0 text-muted" aria-hidden>
                  •
                </span>
                <span>{principle.statement}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <div>
          <SectionLabel>Current Mission</SectionLabel>
          <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90">
            {missionName}
          </p>
          {missionPurpose ? (
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {missionPurpose}
            </p>
          ) : null}
        </div>

        <label className="block" htmlFor="onboarding-intent">
          <SectionLabel>Today&apos;s Intent</SectionLabel>
          <input
            id="onboarding-intent"
            value={intent}
            onChange={(event) => setIntent(event.target.value)}
            placeholder="One clear commitment for today."
            className={`mt-1 w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(intentError))}`}
          />
          <ValidationMessage message={intentError} />
        </label>

        <p className="text-[14px] text-muted">
          Welcome, {session.displayName}. Commit to begin.
        </p>

        <button
          type="button"
          disabled={submitting}
          onClick={() => void commitAndFinish()}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 sm:h-16 sm:text-[15px]"
        >
          {submitting ? "Committing…" : "Commit"}
        </button>
      </div>
    </OnboardingShell>
  );
}
