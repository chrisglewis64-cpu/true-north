"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { contentRevealTransition } from "@/lib/motion/transitions";

type StepMissionCompleteProps = {
  evidenceCount: number;
  standardsHonoured: number;
  onReturnHome: () => void;
};

/**
 * End-of-day completion — calm confidence. Military instrument quiet.
 * No confetti. No celebration. Close today's mission.
 */
export function StepMissionComplete({
  evidenceCount,
  standardsHonoured,
  onReturnHome,
}: StepMissionCompleteProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  function handleReturn() {
    onReturnHome();
    router.push("/operations");
  }

  const lines = [
    standardsHonoured > 0
      ? "You honoured your standards."
      : "You faced your standards honestly.",
    evidenceCount > 0 ? "Evidence recorded." : "Reflection complete.",
    "Identity strengthened.",
    "Rest well.",
    "Tomorrow we continue North.",
  ];

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion ? { duration: 0 } : contentRevealTransition
      }
      className="flex min-h-[60vh] flex-col items-center justify-center text-center"
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
        Today Complete
      </p>

      <div className="mt-12 max-w-sm space-y-4">
        {lines.map((line, index) => (
          <motion.p
            key={line}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { ...contentRevealTransition, delay: 0.12 + index * 0.1 }
            }
            className="text-[17px] leading-relaxed text-foreground/90 sm:text-lg"
          >
            {line}
          </motion.p>
        ))}
      </div>

      <motion.button
        type="button"
        onClick={handleReturn}
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { ...contentRevealTransition, delay: 0.75 }
        }
        className="mt-16 flex h-14 w-full max-w-sm items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16 sm:text-[15px]"
      >
        Return to Compass
      </motion.button>
    </motion.div>
  );
}
