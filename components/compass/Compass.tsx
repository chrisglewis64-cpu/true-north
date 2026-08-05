import { CompassHeadingLabel } from "@/components/compass/CompassHeadingLabel";
import { CompassVisual } from "@/components/compass/CompassVisual";
import { getGuidanceFromAlignment } from "@/lib/compass/guidance";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";

type CompassProps = {
  established: boolean;
  /** Internal alignment 0–100 when established. Never render as a number. */
  alignment: number | null;
  message?: string;
  size?: "large" | "medium";
  showGuidance?: boolean;
  guidanceClassName?: string;
  className?: string;
};

/**
 * Displays compass state from a calculation result.
 * Knows nothing about how alignment is calculated.
 */
export function Compass({
  established,
  alignment,
  message,
  size = "large",
  showGuidance = true,
  guidanceClassName = "",
  className = "",
}: CompassProps) {
  const heading =
    established && alignment !== null
      ? getHeadingFromAlignment(alignment)
      : null;
  const guidance =
    established && alignment !== null
      ? getGuidanceFromAlignment(alignment)
      : message;
  const headingMargin = size === "large" ? "mt-6" : "mt-5";

  return (
    <div className={className}>
      <CompassVisual
        alignment={alignment}
        established={established}
        size={size}
      />
      {heading ? (
        <CompassHeadingLabel heading={heading} className={headingMargin} />
      ) : null}
      {showGuidance && guidance ? (
        <p
          className={`mt-3 text-[15px] leading-relaxed text-muted sm:text-base ${guidanceClassName}`}
        >
          {guidance}
        </p>
      ) : null}
    </div>
  );
}
