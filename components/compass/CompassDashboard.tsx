"use client";

import { useState } from "react";
import { CompassDisplay } from "@/components/compass/CompassDisplay";
import { AlignmentModal } from "@/components/compass/AlignmentModal";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";

export function CompassDashboard() {
  const alignmentView = useCompassAlignment();
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="animate-fade-in py-2 text-center sm:py-4">
        <SectionLabel>Compass</SectionLabel>

        <CompassDisplay heading={alignmentView.alignment.heading} />

        <p className="mx-auto mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
          {alignmentView.guidance}
        </p>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-foreground"
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
