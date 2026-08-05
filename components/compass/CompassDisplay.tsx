"use client";

import { CompassNeedle } from "@/components/compass/CompassNeedle";
import {
  HEADING_ACCENT_CLASS,
  HEADING_INDICATORS,
  HEADING_LABELS,
  type CompassHeading,
} from "@/types/compass";

type CompassDisplayProps = {
  heading: CompassHeading;
};

export function CompassDisplay({ heading }: CompassDisplayProps) {
  return (
    <div className="text-center">
      <CompassNeedle heading={heading} />
      <p
        className={`mt-6 font-mono text-sm font-medium uppercase tracking-[0.2em] sm:text-base ${HEADING_ACCENT_CLASS[heading]}`}
      >
        <span aria-hidden>{HEADING_INDICATORS[heading]} </span>
        {HEADING_LABELS[heading]}
      </p>
    </div>
  );
}
