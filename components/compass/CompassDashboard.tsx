"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Compass } from "@/components/compass/Compass";
import { AlignmentFocusContent } from "@/components/compass/AlignmentFocusContent";
import { useAlignmentFocus } from "@/hooks/useAlignmentFocus";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";
import {
  backdropTransition,
  contentRevealTransition,
} from "@/lib/motion/transitions";

export function CompassDashboard() {
  const { established, alignment, message } = useCompassAlignment();
  const focus = useAlignmentFocus();
  const [open, setOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <section className="animate-fade-in py-4 text-center sm:py-6">
      <h1 className="text-[2rem] font-semibold tracking-[0.08em] text-foreground sm:text-[2.5rem]">
        TRUE NORTH
      </h1>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        Identity · Standards · Mission · Bearings
      </p>

      <div className="mt-8">
        <Compass
          established={established}
          alignment={alignment}
          message={message}
          size="large"
          showGuidance
        />
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-2xl border border-border-subtle px-6 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-muted hover:bg-surface"
      >
        View Alignment
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              key="alignment-backdrop"
              type="button"
              aria-label="Close alignment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : backdropTransition
              }
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]"
            />

            <motion.div
              key="alignment-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Alignment"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : contentRevealTransition
              }
              className="fixed inset-x-0 bottom-0 z-[55] px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:inset-0 sm:flex sm:items-center sm:justify-center sm:px-6 sm:pb-0"
            >
              <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface px-6 py-8 shadow-2xl sm:px-8">
                <AlignmentFocusContent focus={focus} />

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-10 w-full font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
