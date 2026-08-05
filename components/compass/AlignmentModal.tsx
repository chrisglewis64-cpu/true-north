"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CompassDisplay } from "@/components/compass/CompassDisplay";
import { StatusDot } from "@/components/compass/StatusDot";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  modalContentTransition,
  modalTransition,
} from "@/lib/motion/transitions";
import { HEADING_LABELS } from "@/types/compass";
import type { CompassAlignmentView } from "@/hooks/useCompassAlignment";

type AlignmentModalProps = {
  open: boolean;
  onClose: () => void;
  alignmentView: CompassAlignmentView;
};

export function AlignmentModal({
  open,
  onClose,
  alignmentView,
}: AlignmentModalProps) {
  const { alignment, explanation } = alignmentView;
  const heading = alignment.heading;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col bg-background"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={modalTransition}
        >
          <div className="mx-auto flex w-full max-w-lg flex-1 flex-col overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
            <header className="flex flex-col items-center text-center">
              <CompassDisplay heading={heading} />
            </header>

            <motion.div
              className="mt-12 space-y-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={modalContentTransition}
            >
              <section>
                <SectionLabel>Where am I?</SectionLabel>
                <p className="inline-flex items-center gap-2.5 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-foreground/90 sm:text-base">
                  <StatusDot heading={heading} />
                  {HEADING_LABELS[heading]}
                </p>
              </section>

              <section>
                <SectionLabel>Why?</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/85">
                  {explanation.why}
                </p>
              </section>

              <section>
                <SectionLabel>What should I do next?</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {explanation.recommendation}
                </p>
              </section>
            </motion.div>

            <footer className="mt-auto pt-12">
              <button
                type="button"
                onClick={onClose}
                className="flex h-16 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle"
              >
                Close
              </button>
            </footer>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
