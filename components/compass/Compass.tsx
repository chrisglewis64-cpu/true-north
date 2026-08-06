import { CompassHeadingLabel } from "@/components/compass/CompassHeadingLabel";
import { CompassVisual } from "@/components/compass/CompassVisual";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";

type CompassProps = {
  established: boolean;
  /** Identity Alignment 0–100 when established. */
  alignment: number | null;
  /** Identity-centred message when established, or establishing copy. */
  message?: string;
  /** Weekly trend label, e.g. "▲ +1.2 this week". */
  trendLabel?: string | null;
  size?: "large" | "medium";
  showGuidance?: boolean;
  guidanceClassName?: string;
  className?: string;
};

/**
 * Instrument panel for Identity Alignment.
 * Knows nothing about how alignment is calculated.
 */
export function Compass({
  established,
  alignment,
  message,
  trendLabel,
  size = "large",
  showGuidance = true,
  guidanceClassName = "",
  className = "",
}: CompassProps) {
  const heading =
    established && alignment !== null
      ? getHeadingFromAlignment(alignment)
      : null;

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
            {trendLabel ? (
              <p className="mt-2 font-mono text-[12px] tracking-[0.06em] text-muted">
                {trendLabel}
              </p>
            ) : null}
            {heading ? (
              <CompassHeadingLabel heading={heading} className="mt-4" />
            ) : null}
          </>
        ) : (
          <p className="mt-3 font-mono text-sm uppercase tracking-[0.18em] text-muted">
            Establishing…
          </p>
        )}
      </div>

      {showGuidance && message ? (
        <p
          className={`mt-4 text-[15px] leading-relaxed text-muted sm:text-base ${guidanceClassName}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
