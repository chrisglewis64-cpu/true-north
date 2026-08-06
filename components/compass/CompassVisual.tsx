"use client";

import { useEffect, useState } from "react";
import { getCompassRingClass } from "@/lib/compass-data";
import {
  getHeadingFromAlignment,
  getNeedleRotationFromAlignment,
} from "@/lib/compass/alignment";

type CompassVisualProps = {
  alignment: number | null;
  established?: boolean;
  size?: "large" | "medium";
};

/**
 * Iconic compass: fixed centre, outer-ring green arrowhead only.
 * The arrow rotates around the circumference — never drifts inward.
 */
export function CompassVisual({
  alignment,
  established = true,
  size = "large",
}: CompassVisualProps) {
  const heading =
    established && alignment !== null
      ? getHeadingFromAlignment(alignment)
      : "true_north";
  const ringClass = established
    ? getCompassRingClass(heading)
    : "text-border-subtle/40";
  const targetRotation =
    established && alignment !== null
      ? getNeedleRotationFromAlignment(alignment)
      : 0;
  const [rotation, setRotation] = useState(0);
  const sizeClass =
    size === "large"
      ? "h-56 w-56 sm:h-64 sm:w-64"
      : "h-40 w-40 sm:h-44 sm:w-44";

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setRotation(targetRotation);
    });

    return () => cancelAnimationFrame(frame);
  }, [targetRotation]);

  return (
    <div
      className={`relative mx-auto flex ${sizeClass} items-center justify-center`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        className="h-full w-full"
      >
        {/* Outer bearing ring */}
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="currentColor"
          strokeWidth="1.25"
          className={ringClass}
        />
        {/* Inner calm ring */}
        <circle
          cx="100"
          cy="100"
          r="64"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="16"
            x2="100"
            y2="28"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-subtle"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}

        {/* Green arrowhead on outer ring — points outward; rotates about centre only */}
        <g
          className="compass-bearing"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Invisible full-dial box keeps transform-origin at true centre */}
          <rect x="0" y="0" width="200" height="200" fill="transparent" />
          <polygon
            points="100,6 93.5,20 100,16.5 106.5,20"
            fill="currentColor"
            className="text-accent"
          />
        </g>

        {/* Fixed centre — never moves with heading */}
        <circle
          cx="100"
          cy="100"
          r="3.5"
          fill="currentColor"
          className="text-foreground/75"
        />
      </svg>
    </div>
  );
}
