"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CompassNeedle } from "@/components/compass/CompassNeedle";
import { SectionLabel } from "@/components/ui/SectionCard";
import { modalTransition } from "@/lib/motion/transitions";
import {
  HEADING_INDICATORS,
  HEADING_LABELS,
} from "@/types/compass";
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
            <header className="text-center">
              <SectionLabel>Alignment Report</SectionLabel>
              <div className="mt-4">
                <CompassNeedle heading={heading} />
              </div>
            </header>

            <div className="mt-10 space-y-8">
              <section>
                <SectionLabel>Current Heading</SectionLabel>
                <p className="text-[17px] font-medium leading-relaxed text-foreground/90">
                  <span aria-hidden>{HEADING_INDICATORS[heading]} </span>
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
                  {activeMission?.name ?? "No active mission."}
                </p>
              </section>

              <section>
                <SectionLabel>Today&apos;s Recommendation</SectionLabel>
                <p className="text-[15px] leading-relaxed text-foreground/90">
                  {placeholders.todaysRecommendation}
                </p>
              </section>
            </div>

            <footer className="mt-12">
              <button
                type="button"
                onClick={onClose}
                className="flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
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
