"use client";

import { motion } from "framer-motion";
import {
  HEADING_ARROW_FILL_CLASS,
  HEADING_ARROW_ROTATION,
  type CompassHeading,
} from "@/types/compass";
import {
  arrowTransition,
  centerDotBreathingTransition,
} from "@/lib/motion/transitions";

type CompassDialProps = {
  heading: CompassHeading;
};

const CENTER = 100;

/** Arrowhead only — inner vertex at centre; tip points north at 0°. */
const ARROWHEAD_PATH = `M ${CENTER} 78 L 91 106 L ${CENTER} ${CENTER} L 109 106 Z`;

const CARDINALS = [
  { label: "N", x: 100, y: 14 },
  { label: "E", x: 186, y: 104 },
  { label: "S", x: 100, y: 194 },
  { label: "W", x: 14, y: 104 },
] as const;

export function CompassDial({ heading }: CompassDialProps) {
  const rotation = HEADING_ARROW_ROTATION[heading];

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

        <motion.g
          animate={{ rotate: rotation }}
          transition={arrowTransition}
          style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
        >
          <motion.path
            key={heading}
            d={ARROWHEAD_PATH}
            fill="currentColor"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={HEADING_ARROW_FILL_CLASS[heading]}
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
