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
  const { alignment, placeholders, activeMission } = alignmentView;
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
              className="mt-10 space-y-8"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={modalContentTransition}
            >
              <section>
                <SectionLabel>Current Heading</SectionLabel>
                <p className="inline-flex items-center gap-2.5 text-[15px] leading-relaxed text-foreground/90">
                  <StatusDot heading={heading} />
                  {HEADING_LABELS[heading]}
                </p>
              </section>

              <section>
                <SectionLabel>Strongest Standard</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {placeholders.strongestStandard}
                </p>
              </section>

              <section>
                <SectionLabel>Area to Improve</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {placeholders.areaToImprove}
                </p>
              </section>

              <section>
                <SectionLabel>Current Mission</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {activeMission?.name ?? "Lead My Family With Integrity"}
                </p>
              </section>

              <section>
                <SectionLabel>Today&apos;s Recommendation</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {placeholders.todaysRecommendation}
                </p>
              </section>
            </motion.div>

            <footer className="mt-12">
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
