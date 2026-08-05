"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StatusDot } from "@/components/compass/StatusDot";
import { compassTextTransition } from "@/lib/motion/transitions";
import {
  HEADING_ACCENT_CLASS,
  HEADING_LABELS,
  type CompassHeading,
} from "@/types/compass";

type CompassHeadingTextProps = {
  heading: CompassHeading;
};

export function CompassHeadingText({ heading }: CompassHeadingTextProps) {
  return (
    <>
      <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Current Heading
      </p>
      <AnimatePresence mode="wait">
        <motion.p
          key={heading}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={compassTextTransition}
          className={`mt-3 inline-flex items-center justify-center gap-2.5 font-mono text-sm font-medium uppercase tracking-[0.2em] sm:text-base ${HEADING_ACCENT_CLASS[heading]}`}
        >
          <StatusDot heading={heading} />
          {HEADING_LABELS[heading]}
        </motion.p>
      </AnimatePresence>
    </>
  );
}
