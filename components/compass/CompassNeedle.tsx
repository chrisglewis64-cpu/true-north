"use client";

import { motion } from "framer-motion";
import {
  HEADING_NEEDLE_ROTATION,
  type CompassHeading,
} from "@/types/compass";
import {
  centerDotBreathingTransition,
  needleTransition,
} from "@/lib/motion/transitions";

type CompassNeedleProps = {
  heading: CompassHeading;
};

const CARDINALS = [
  { label: "N", x: 100, y: 14 },
  { label: "E", x: 186, y: 104 },
  { label: "S", x: 100, y: 194 },
  { label: "W", x: 14, y: 104 },
] as const;

export function CompassNeedle({ heading }: CompassNeedleProps) {
  const rotation = HEADING_NEEDLE_ROTATION[heading];

  return (
    <div className="relative mx-auto h-[240px] w-[240px]">
      <svg
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        className="h-full w-full overflow-visible"
      >
        <defs>
          <filter id="compass-center-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

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

        {CARDINALS.map(({ label, x, y }) => (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-muted/35 font-mono text-[11px] font-medium"
          >
            {label}
          </text>
        ))}

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
          transition={needleTransition}
          style={{ transformOrigin: "100px 100px" }}
        >
          <line
            x1="100"
            y1="100"
            x2="100"
            y2="36"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-accent"
          />
          <polygon
            points="100,30 96.5,42 100,38.5 103.5,42"
            fill="currentColor"
            className="text-accent"
          />
        </motion.g>

        <motion.g
          animate={{ scale: [1, 1.03, 1] }}
          transition={centerDotBreathingTransition}
          style={{ transformOrigin: "100px 100px" }}
        >
          <circle
            cx="100"
            cy="100"
            r="7"
            fill="currentColor"
            className="text-accent/20"
            filter="url(#compass-center-glow)"
          />
          <circle
            cx="100"
            cy="100"
            r="4.5"
            fill="currentColor"
            className="text-accent"
          />
        </motion.g>
      </svg>
    </div>
  );
}
