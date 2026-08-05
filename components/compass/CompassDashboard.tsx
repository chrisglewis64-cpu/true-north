"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { Compass } from "@/components/compass/Compass";
import { AlignmentReportContent } from "@/components/compass/AlignmentReportContent";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";
import {
  backdropTransition,
  compassInteraction,
  compassInteractionTransition,
  contentRevealTransition,
  expandedCompassScale,
  layoutTransition,
} from "@/lib/motion/transitions";

export function CompassDashboard() {
  const { established, alignment, message } = useCompassAlignment();
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!expanded) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expanded]);

  const layoutDuration = prefersReducedMotion
    ? 0
    : layoutTransition.duration;

  return (
    <LayoutGroup id="compass-expand">
      <section className="animate-fade-in py-4 text-center sm:py-6">
        <AnimatePresence mode="popLayout" initial={false}>
          {!expanded ? (
            <motion.p
              key="compass-label"
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: layoutDuration }}
              className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted"
            >
              Compass
            </motion.p>
          ) : (
            <motion.div
              key="compass-placeholder"
              layout="position"
              aria-hidden
              className="invisible select-none"
              initial={false}
            >
              <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em]">
                Compass
              </p>
              <div className="h-52 sm:h-60" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em]">
                View Alignment Report →
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          layoutRoot={expanded}
          layoutId="compass-shell"
          transition={{
            layout: { duration: layoutDuration, ease: layoutTransition.ease },
          }}
          className={
            expanded
              ? "fixed left-1/2 top-[12%] z-[60] w-full max-w-lg -translate-x-1/2 px-6 text-center"
              : "group relative z-10 mx-auto w-full max-w-lg cursor-pointer"
          }
          onClick={!expanded ? () => setExpanded(true) : undefined}
          onKeyDown={
            !expanded
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setExpanded(true);
                  }
                }
              : undefined
          }
          role={!expanded ? "button" : undefined}
          tabIndex={!expanded ? 0 : undefined}
          aria-expanded={expanded}
          aria-haspopup="dialog"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {expanded ? (
              <motion.p
                key="expanded-heading-label"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: layoutDuration }}
                className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted"
              >
                Current Heading
              </motion.p>
            ) : null}
          </AnimatePresence>

          <motion.div
            layout
            animate={{
              scale: expanded ? expandedCompassScale : 1,
              y: 0,
            }}
            whileHover={
              !expanded && !prefersReducedMotion
                ? compassInteraction.hover
                : undefined
            }
            whileTap={
              !expanded && !prefersReducedMotion
                ? compassInteraction.tap
                : undefined
            }
            transition={{
              layout: { duration: layoutDuration, ease: layoutTransition.ease },
              scale: compassInteractionTransition,
              y: compassInteractionTransition,
            }}
            className="origin-center"
          >
            <Compass
              established={established}
              alignment={alignment}
              message={message}
              size="large"
              showGuidance={!expanded || !established}
              guidanceClassName={
                !expanded
                  ? "transition-colors group-hover:text-foreground/80"
                  : ""
              }
            />
          </motion.div>

          <AnimatePresence mode="popLayout" initial={false}>
            {!expanded ? (
              <motion.p
                key="compass-affordance"
                layout="position"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: layoutDuration }}
                className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted/70 transition-colors duration-200 group-hover:text-muted"
              >
                View Alignment Report →
              </motion.p>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {expanded ? (
            <>
              <motion.button
                key="compass-backdrop"
                type="button"
                aria-label="Close alignment report"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : backdropTransition
                }
                onClick={() => setExpanded(false)}
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-[2px]"
              />

              <motion.div
                key="compass-report"
                role="dialog"
                aria-modal="true"
                aria-label="Alignment Report"
                initial={
                  prefersReducedMotion ? false : { opacity: 0, y: 16 }
                }
                animate={{ opacity: 1, y: 0 }}
                exit={
                  prefersReducedMotion ? undefined : { opacity: 0, y: 8 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : contentRevealTransition
                }
                className="fixed inset-0 z-[55] overflow-y-auto"
              >
                <div className="mx-auto w-full max-w-lg px-6 pb-16 pt-[min(52vh,26rem)] sm:max-w-xl sm:px-8 sm:pt-[min(48vh,28rem)] lg:max-w-2xl">
                  <AlignmentReportContent />

                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="mt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  );
}
