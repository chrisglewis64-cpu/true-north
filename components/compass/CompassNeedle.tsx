"use client";

import { motion } from "framer-motion";
import {
  HEADING_NEEDLE_ROTATION,
  type CompassHeading,
} from "@/types/compass";
import { compassTransition } from "@/lib/motion/transitions";

type CompassNeedleProps = {
  heading: CompassHeading;
};

export function CompassNeedle({ heading }: CompassNeedleProps) {
  const rotation = HEADING_NEEDLE_ROTATION[heading];

  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
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
          className="text-border-subtle"
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
        <motion.g
          animate={{ rotate: rotation }}
          transition={compassTransition}
          style={{ originX: "100px", originY: "100px" }}
        >
          <polygon
            points="100,36 94,58 100,52 106,58"
            fill="currentColor"
            className="text-accent"
          />
        </motion.g>
        <circle
          cx="100"
          cy="100"
          r="4"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-6">
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted sm:text-[11px]">
          True North
        </span>
      </div>
    </div>
  );
}
