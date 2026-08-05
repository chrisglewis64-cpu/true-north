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

const CENTER = 100;
const NEEDLE_TIP_Y = 26;

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
          <filter
            id="compass-center-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r="92"
          stroke="currentColor"
          strokeWidth="1"
          className="text-border-subtle"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
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
            className="fill-muted/25 font-mono text-[9px] font-medium"
          >
            {label}
          </text>
        ))}

        {[0, 90, 180, 270].map((angle) => (
          <line
            key={angle}
            x1={CENTER}
            y1="18"
            x2={CENTER}
            y2="30"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border-subtle"
            transform={`rotate(${angle} ${CENTER} ${CENTER})`}
          />
        ))}

        <motion.g
          animate={{ rotate: rotation }}
          transition={needleTransition}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <line
            x1={CENTER}
            y1={CENTER}
            x2={CENTER}
            y2={NEEDLE_TIP_Y + 8}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-foreground/70"
          />
          <polygon
            points={`${CENTER},${NEEDLE_TIP_Y} ${CENTER - 2.5},${NEEDLE_TIP_Y + 7} ${CENTER},${NEEDLE_TIP_Y + 4.5} ${CENTER + 2.5},${NEEDLE_TIP_Y + 7}`}
            fill="currentColor"
            className="text-foreground/75"
          />
        </motion.g>

        <motion.g
          animate={{ scale: [1, 1.03, 1] }}
          transition={centerDotBreathingTransition}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r="8"
            fill="currentColor"
            className="text-accent/15"
            filter="url(#compass-center-glow)"
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r="5"
            fill="currentColor"
            className="text-accent"
          />
        </motion.g>
      </svg>
    </div>
  );
}
