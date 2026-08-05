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
    <div className="relative mx-auto h-[240px] w-[240px]">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        className="h-full w-full"
      >
        <circle
          cx="100"
          cy="100"
          r="92"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border-subtle"
        />
        <circle
          cx="100"
          cy="100"
          r="76"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border"
        />
        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1="100"
            y1="14"
            x2="100"
            y2="28"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-subtle"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}
        <motion.g
          animate={{ rotate: rotation }}
          transition={compassTransition}
          style={{ transformOrigin: "100px 100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-accent"
          />
          <polygon
            points="100,28 95,40 100,36 105,40"
            fill="currentColor"
            className="text-accent"
          />
        </motion.g>
        <circle
          cx="100"
          cy="100"
          r="5"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
    </div>
  );
}
