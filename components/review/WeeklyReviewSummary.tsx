"use client";

import { motion, useReducedMotion } from "framer-motion";
import { contentRevealTransition } from "@/lib/motion/transitions";
import type { WeeklySummary } from "@/lib/review/build-weekly-summary";

type WeeklyReviewSummaryProps = {
  summary: WeeklySummary;
  onReturn: () => void;
};

/**
 * Calm weekly close — thoughtful reflection, no charts or gamification.
 */
export function WeeklyReviewSummary({
  summary,
  onReturn,
}: WeeklyReviewSummaryProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion ? { duration: 0 } : contentRevealTransition
      }
      className="flex min-h-[60vh] flex-col"
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-accent">
        This Week
      </p>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        {summary.weekLabel}
      </p>

      <div className="mt-12 space-y-10">
        {summary.honoured ? (
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              You honoured
            </p>
            <p className="mt-3 text-[1.25rem] font-medium leading-snug tracking-tight text-foreground">
              &ldquo;{summary.honoured.statement}&rdquo;
            </p>
            <p className="mt-3 text-[15px] text-muted">
              {summary.honoured.yesCount}{" "}
              {summary.honoured.yesCount === 1 ? "time" : "times"}.
            </p>
          </section>
        ) : (
          <section>
            <p className="text-[15px] leading-relaxed text-muted">
              Complete more Daily Debriefs to build this week&apos;s honour
              record.
            </p>
          </section>
        )}

        {summary.drifted ? (
          <section>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              You drifted from
            </p>
            <p className="mt-3 text-[1.25rem] font-medium leading-snug tracking-tight text-foreground">
              &ldquo;{summary.drifted.statement}&rdquo;
            </p>
            <p className="mt-3 text-[15px] text-muted">
              {summary.drifted.noCount}{" "}
              {summary.drifted.noCount === 1 ? "time" : "times"}.
            </p>
          </section>
        ) : null}

        <section className="grid grid-cols-2 gap-8 border-y border-border py-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Strongest Standard
            </p>
            <p className="mt-3 text-[17px] font-medium text-foreground">
              {summary.strongestTheme}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Needs Attention
            </p>
            <p className="mt-3 text-[17px] font-medium text-foreground">
              {summary.attentionTheme}
            </p>
          </div>
        </section>

        <section>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Identity Alignment
          </p>
          <p className="mt-3 text-[1.75rem] font-semibold tracking-tight text-foreground">
            {summary.alignmentDeltaLabel}
          </p>
        </section>

        <p className="pt-4 text-[17px] font-medium text-foreground/90">
          Keep heading North.
        </p>
      </div>

      <button
        type="button"
        onClick={onReturn}
        className="mt-14 flex h-14 w-full items-center justify-center rounded-2xl border border-border bg-surface font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
      >
        Return to Review
      </button>
    </motion.div>
  );
}
