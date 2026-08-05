"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CompassDisplay } from "@/components/compass/CompassDisplay";
import { CompassHeadingText } from "@/components/compass/CompassHeadingText";
import { AlignmentModal } from "@/components/compass/AlignmentModal";
import { compassTextTransition } from "@/lib/motion/transitions";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";

export function CompassDashboard() {
  const alignmentView = useCompassAlignment();
  const [open, setOpen] = useState(false);
  const heading = alignmentView.alignment.heading;

  const openAlignment = () => setOpen(true);

  return (
    <LayoutGroup id="compass-alignment-group">
      <section className="animate-fade-in py-4 text-center sm:py-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          TRUE NORTH
        </h1>

        <div className="mt-8">
          <CompassDisplay heading={heading} onOpen={openAlignment} />
        </div>

        <CompassHeadingText heading={heading} />

        <AnimatePresence mode="wait">
          <motion.p
            key={heading}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={compassTextTransition}
            className="mx-auto mt-4 max-w-xs text-[16px] font-medium leading-snug tracking-tight text-foreground/80 sm:text-[17px]"
          >
            {alignmentView.guidance}
          </motion.p>
        </AnimatePresence>

        <button
          type="button"
          onClick={openAlignment}
          className="mx-auto mt-9 flex h-[3.5rem] min-w-[15rem] items-center justify-center rounded-2xl border border-border-subtle bg-surface px-10 font-mono text-xs font-medium uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent/40 hover:bg-surface-elevated"
        >
          View Alignment
        </button>
      </section>

      <AlignmentModal
        open={open}
        onClose={() => setOpen(false)}
        alignmentView={alignmentView}
      />
    </LayoutGroup>
  );
}
