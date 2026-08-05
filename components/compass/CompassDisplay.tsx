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
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
        True North
      </p>

      <div className="mt-5">
        <CompassNeedle heading={heading} />
      </div>

      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Current Heading
      </p>
      <p
        className={`mt-2 font-mono text-sm font-medium uppercase tracking-[0.2em] sm:text-base ${HEADING_ACCENT_CLASS[heading]}`}
      >
        <span aria-hidden>{HEADING_INDICATORS[heading]} </span>
        {HEADING_LABELS[heading]}
      </p>
    </div>
  );
}
