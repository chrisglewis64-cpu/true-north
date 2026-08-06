"use client";

import { useRouter } from "next/navigation";
import { SectionLabel } from "@/components/ui/SectionCard";
import { fieldErrorClass } from "@/components/ui/ValidationMessage";

const courseCorrectionExamples = [
  "Prepare my clothes tonight.",
  "Put my phone away earlier.",
  "Review spending before buying.",
  "Read Scripture before checking messages.",
] as const;

type StepMissionCompleteProps = {
  todaysCommitment: string;
  tomorrowsOnePercent: string;
  courseCorrection: string;
  onCourseCorrection: (value: string) => void;
  onReturnHome: () => void;
};

export function StepMissionComplete({
  todaysCommitment,
  tomorrowsOnePercent,
  courseCorrection,
  onCourseCorrection,
  onReturnHome,
}: StepMissionCompleteProps) {
  const router = useRouter();

  function handleReturnHome() {
    onReturnHome();
    router.push("/operations");
  }

  return (
    <div>
      <header className="text-center">
        <SectionLabel>Mission Complete</SectionLabel>
      </header>

      <div className="mt-10 space-y-8">
        <section>
          <SectionLabel>Today&apos;s Commitment</SectionLabel>
          <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
            {todaysCommitment.trim() || "—"}
          </p>
        </section>

        <section>
          <SectionLabel>Tomorrow&apos;s 1%</SectionLabel>
          <p className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg">
            {tomorrowsOnePercent.trim() || "—"}
          </p>
        </section>

        <section>
          <label className="block" htmlFor="field-courseCorrection">
            <p className="text-[15px] leading-relaxed text-foreground/90 sm:text-base">
              What one course correction will make tomorrow better?
            </p>
            <input
              id="field-courseCorrection"
              type="text"
              value={courseCorrection}
              onChange={(e) => onCourseCorrection(e.target.value)}
              placeholder="One small adjustment."
              className={`mt-4 w-full rounded-xl border bg-surface px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(false)}`}
            />
          </label>
          <ul className="mt-4 space-y-2">
            {courseCorrectionExamples.map((example) => (
              <li
                key={example}
                className="font-mono text-[11px] leading-relaxed text-muted"
              >
                • {example}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <button
        type="button"
        onClick={handleReturnHome}
        className="mt-12 flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16 sm:text-[15px]"
      >
        Return Home
      </button>
    </div>
  );
}
