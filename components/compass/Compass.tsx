import { CompassHeadingLabel } from "@/components/compass/CompassHeadingLabel";
import { CompassVisual } from "@/components/compass/CompassVisual";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";
import type { IdentityInsight } from "@/lib/identity-insight";

type CompassProps = {
  established: boolean;
  /** Identity Alignment 0–100 when established. */
  alignment: number | null;
  /** Establishing copy when not yet established. */
  message?: string;
  /** Weekly trend label, e.g. "▲ +1.2 this week". */
  trendLabel?: string | null;
  /** Active coaching insight — UI reads text only. */
  insight?: IdentityInsight | null;
  size?: "large" | "medium";
  showInsight?: boolean;
  className?: string;
};

/**
 * Instrument panel for Identity Alignment + Identity Insight.
 * Knows nothing about how either is calculated.
 */
export function Compass({
  established,
  alignment,
  message,
  trendLabel,
  insight,
  size = "large",
  showInsight = true,
  className = "",
}: CompassProps) {
  const heading =
    established && alignment !== null
      ? getHeadingFromAlignment(alignment)
      : null;

  const insightText = insight?.text;

  return (
    <div className={className}>
      <CompassVisual
        alignment={alignment}
        established={established}
        size={size}
      />

      <div className={size === "large" ? "mt-8" : "mt-6"}>
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Identity Alignment
        </p>

        {established && alignment !== null ? (
          <>
            <p className="mt-3 font-mono text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
              {alignment}%
            </p>
            {heading ? (
              <CompassHeadingLabel heading={heading} className="mt-3" />
            ) : null}
            {trendLabel ? (
              <p className="mt-2 font-mono text-[12px] tracking-[0.06em] text-muted">
                {trendLabel}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-muted">
            Establishing…
          </p>
        )}
      </div>

      {showInsight && (insightText || (!established && message)) ? (
        <div className="mx-auto mt-8 w-full max-w-md">
          <div className="border-t border-border-subtle" />
          <div className="px-1 py-6">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Identity Insight
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90 sm:text-base">
              &ldquo;{insightText ?? message}&rdquo;
            </p>
          </div>
          <div className="border-t border-border-subtle" />
        </div>
      ) : null}
    </div>
  );
}
