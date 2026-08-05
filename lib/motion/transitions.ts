/** Calm, restrained motion — no bounce. Used across True North. */
export const calmEase = [0.25, 0.1, 0.25, 1] as const;

export const motionDurations = {
  fast: 0.25,
  standard: 0.4,
  slow: 0.55,
} as const;

export const backdropTransition = {
  duration: motionDurations.standard,
  ease: calmEase,
} as const;

export const layoutTransition = {
  duration: motionDurations.slow,
  ease: calmEase,
} as const;

export const contentRevealTransition = {
  duration: motionDurations.standard,
  ease: calmEase,
  delay: 0.12,
} as const;

export const expandedCompassScale = 1.08;

/** Premium pointer feedback — tween only, no spring. */
export const compassInteractionTransition = {
  duration: motionDurations.fast,
  ease: calmEase,
} as const;

export const compassInteraction = {
  hover: { y: -5 },
  tap: { y: -1, scale: 0.985 },
} as const;
