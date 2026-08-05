"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

type CompleteMissionFormProps = {
  missionId: string;
  missionName: string;
};

export function CompleteMissionForm({
  missionId,
  missionName,
}: CompleteMissionFormProps) {
  const router = useRouter();
  const { completeMission } = useTrueNorth();
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [error, setError] = useState<string>();
  const [summary, setSummary] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!lessonsLearned.trim()) {
      setError("Lessons learned are required to complete a mission.");
      setSummary("Capture what this season taught you.");
      return;
    }

    completeMission(missionId, lessonsLearned.trim());
    router.push("/mission");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <header>
        <SectionLabel>Complete Mission</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          {missionName}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          This mission will become a permanent record of growth.
        </p>
      </header>

      <ValidationSummary message={summary} />

      <div>
        <label htmlFor="lessons-learned" className="block">
          <SectionLabel>Lessons Learned</SectionLabel>
          <textarea
            id="lessons-learned"
            value={lessonsLearned}
            onChange={(e) => {
              setLessonsLearned(e.target.value);
              if (error) setError(undefined);
              if (summary) setSummary(undefined);
            }}
            rows={4}
            placeholder="What did this season teach you?"
            aria-invalid={Boolean(error)}
            className={`w-full resize-none rounded-xl border bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(Boolean(error))}`}
          />
        </label>
        <ValidationMessage message={error} />
      </div>

      <button
        type="submit"
        className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:h-16"
      >
        Complete Mission
      </button>

      <Link
        href="/mission"
        className="flex h-12 w-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
      >
        Cancel
      </Link>
    </form>
  );
}
