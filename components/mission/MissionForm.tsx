"use client";

import { useState, type FormEvent } from "react";
import type { MissionInput, MissionStatus } from "@/types/mission";
import {
  DEFAULT_MISSION_STATUS,
  getEditableMissionStatusOptions,
  getMissionStatusOption,
} from "@/lib/mission-status";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

type MissionFormProps = {
  initialValues?: MissionInput;
  submitLabel: string;
  onSubmit: (input: MissionInput) => void;
  showStatusSelector?: boolean;
  includeCompleteStatus?: boolean;
};

const emptyValues: MissionInput = {
  name: "",
  purpose: "",
  category: "",
  whyThisMatters: "",
  successCriteria: "",
  currentProgress: "Just started",
  nextMilestone: "",
  missionStatus: DEFAULT_MISSION_STATUS,
};

type MissionFormErrors = Partial<Record<keyof MissionInput, string>>;

function validateMissionInput(input: MissionInput): {
  isValid: boolean;
  errors: MissionFormErrors;
  summary?: string;
} {
  const errors: MissionFormErrors = {};

  if (!input.name.trim()) errors.name = "Mission name is required.";
  if (!input.purpose.trim()) errors.purpose = "Mission purpose is required.";
  if (!input.currentProgress.trim()) {
    errors.currentProgress = "Current progress is required.";
  }
  if (!input.nextMilestone.trim()) {
    errors.nextMilestone = "Next milestone is required.";
  }

  const issueCount = Object.keys(errors).length;
  if (issueCount === 0) return { isValid: true, errors: {} };

  return {
    isValid: false,
    errors,
    summary:
      issueCount === 1
        ? "One required field needs your attention."
        : `${issueCount} required fields need your attention.`,
  };
}

export function MissionForm({
  initialValues = emptyValues,
  submitLabel,
  onSubmit,
  showStatusSelector = false,
  includeCompleteStatus = false,
}: MissionFormProps) {
  const [form, setForm] = useState<MissionInput>(initialValues);
  const [errors, setErrors] = useState<MissionFormErrors>({});
  const [summary, setSummary] = useState<string>();

  const statusOptions = getEditableMissionStatusOptions(includeCompleteStatus);
  const selectedStatus = getMissionStatusOption(form.missionStatus);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateMissionInput(form);
    if (!result.isValid) {
      setErrors(result.errors);
      setSummary(result.summary);
      return;
    }
    setErrors({});
    setSummary(undefined);
    onSubmit(form);
  }

  function updateField<K extends keyof MissionInput>(
    field: K,
    value: MissionInput[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <ValidationSummary message={summary} />

      <Field
        label="Mission Name"
        id="mission-name"
        value={form.name}
        error={errors.name}
        onChange={(value) => updateField("name", value)}
        placeholder="What are you building?"
      />

      <TextArea
        label="Mission Purpose"
        id="mission-purpose"
        value={form.purpose}
        error={errors.purpose}
        onChange={(value) => updateField("purpose", value)}
        placeholder="Describe this season of focus."
      />

      <TextArea
        label="Why This Matters"
        id="mission-why"
        value={form.whyThisMatters}
        onChange={(value) => updateField("whyThisMatters", value)}
        placeholder="Connect this to your identity."
        optional
      />

      <TextArea
        label="Success Criteria"
        id="mission-success"
        value={form.successCriteria}
        onChange={(value) => updateField("successCriteria", value)}
        placeholder="How will you know this season succeeded?"
        optional
      />

      <Field
        label="Current Progress"
        id="mission-progress"
        value={form.currentProgress}
        error={errors.currentProgress}
        onChange={(value) => updateField("currentProgress", value)}
        placeholder="Where are you now?"
      />

      <Field
        label="Next Milestone"
        id="mission-milestone"
        value={form.nextMilestone}
        error={errors.nextMilestone}
        onChange={(value) => updateField("nextMilestone", value)}
        placeholder="What is the next meaningful step?"
      />

      {showStatusSelector && (
        <div>
          <label htmlFor="mission-status" className="block">
            <SectionLabel>Mission Status</SectionLabel>
            <div className="relative">
              <select
                id="mission-status"
                value={form.missionStatus}
                onChange={(event) =>
                  updateField(
                    "missionStatus",
                    event.target.value as MissionStatus
                  )
                }
                className={`w-full appearance-none rounded-xl border bg-surface px-4 py-3 pr-10 text-[15px] text-foreground focus:outline-none ${fieldErrorClass(Boolean(errors.missionStatus))}`}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.emoji} {option.label}
                  </option>
                ))}
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted"
              >
                ▾
              </span>
            </div>
          </label>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {selectedStatus.description}
          </p>
          <ValidationMessage message={errors.missionStatus} />
        </div>
      )}

      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:h-16"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  error,
  onChange,
  placeholder,
  optional,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block">
        <SectionLabel>
          {label}
          {optional && (
            <span className="ml-1 normal-case tracking-normal text-muted/70">
              (optional)
            </span>
          )}
        </SectionLabel>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(error))}`}
        />
      </label>
      <ValidationMessage message={error} />
    </div>
  );
}

function TextArea({
  label,
  id,
  value,
  error,
  onChange,
  placeholder,
  optional,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block">
        <SectionLabel>
          {label}
          {optional && (
            <span className="ml-1 normal-case tracking-normal text-muted/70">
              (optional)
            </span>
          )}
        </SectionLabel>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          aria-invalid={Boolean(error)}
          className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(error))}`}
        />
      </label>
      <ValidationMessage message={error} />
    </div>
  );
}
