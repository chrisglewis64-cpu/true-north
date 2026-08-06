import type { AlignmentFocus } from "@/lib/compass/alignment-focus";

type AlignmentFocusContentProps = {
  focus: AlignmentFocus;
};

/**
 * Lightweight alignment guidance — status reasons + one recommended focus.
 * No graphs, scores, or percentages.
 */
export function AlignmentFocusContent({ focus }: AlignmentFocusContentProps) {
  return (
    <div className="text-left">
      <section>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Current Status
        </p>
        <p className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {focus.statusLabel}
        </p>
        <ul className="mt-4 space-y-2.5">
          {focus.reasons.map((reason) => (
            <li
              key={reason}
              className="flex gap-3 text-[15px] leading-relaxed text-muted"
            >
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border-t border-border pt-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Recommended Focus
        </p>
        <p className="mt-3 text-[17px] font-medium leading-relaxed tracking-tight text-foreground">
          {focus.recommendation}
        </p>
      </section>
    </div>
  );
}
