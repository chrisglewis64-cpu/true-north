"use client";

import { useEffect, useState } from "react";
import {
  getCompassNeedleClass,
  getCompassRingClass,
} from "@/lib/compass-data";
import {
  getHeadingFromAlignment,
  getNeedleRotationFromAlignment,
} from "@/lib/compass/alignment";

type CompassVisualProps = {
  alignment: number | null;
  established?: boolean;
  size?: "large" | "medium";
};

export function CompassVisual({
  alignment,
  established = true,
  size = "large",
}: CompassVisualProps) {
  const heading = established && alignment !== null
    ? getHeadingFromAlignment(alignment)
    : "true_north";
  const needleClass = established
    ? getCompassNeedleClass(heading)
    : "text-muted/60";
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
      ? "h-52 w-52 sm:h-60 sm:w-60"
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
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="currentColor"
          strokeWidth="1"
          className={ringClass}
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="18"
            x2="100"
            y2="30"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-subtle"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
        <g
          className="compass-needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <polygon
            points="100,36 94,58 100,52 106,58"
            fill="currentColor"
            className={needleClass}
          />
        </g>
        <circle
          cx="100"
          cy="100"
          r="4"
          fill="currentColor"
          className={needleClass}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted sm:text-[11px]">
          True North
        </span>
      </div>
    </div>
  );
}
