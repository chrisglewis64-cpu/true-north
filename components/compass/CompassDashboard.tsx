"use client";

import { useState } from "react";
import { CompassDisplay } from "@/components/compass/CompassDisplay";
import { AlignmentModal } from "@/components/compass/AlignmentModal";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";

export function CompassDashboard() {
  const alignmentView = useCompassAlignment();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="animate-fade-in py-4 text-center sm:py-6">
        <CompassDisplay heading={alignmentView.alignment.heading} />

        <p className="mx-auto mt-8 max-w-xs text-[16px] font-medium leading-snug tracking-tight text-foreground/85 sm:text-[17px]">
          {alignmentView.guidance}
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mx-auto mt-8 flex h-12 min-w-[11rem] items-center justify-center rounded-2xl border border-border-subtle bg-surface px-6 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated sm:h-[3.25rem] sm:text-xs"
        >
          View Alignment
        </button>
      </section>

      <AlignmentModal
        open={open}
        onClose={() => setOpen(false)}
        alignmentView={alignmentView}
      />
    </>
  );
}
