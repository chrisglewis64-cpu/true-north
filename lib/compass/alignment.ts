import type { CompassHeading } from "@/types/compass";

/** Internal alignment score (0–100). Never render in UI. */
export type CompassAlignment = number;

function clampAlignment(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Stable east (+) / west (−) bias from alignment — not random per frame. */
function needleDirection(alignment: number): 1 | -1 {
  return alignment % 2 === 0 ? 1 : -1;
}

/**
 * Maps internal alignment to discrete heading labels and colors.
 * The numeric value is never shown — only the heading name.
 */
export function getHeadingFromAlignment(
  alignment: CompassAlignment
): CompassHeading {
  const value = clampAlignment(alignment);

  if (value >= 90) return "true_north";
  if (value >= 70) return "drifting";
  if (value >= 40) return "off_course";
  return "lost";
}

/**
 * Maps internal alignment to needle rotation in degrees.
 * 90–100 → near north · 70–89 → slight drift · 40–69 → noticeable · 0–39 → significant
 */
export function getNeedleRotationFromAlignment(
  alignment: CompassAlignment
): number {
  const value = clampAlignment(alignment);
  const direction = needleDirection(value);

  if (value >= 90) {
    const t = (100 - value) / 10;
    return direction * lerp(0, 2, t);
  }

  if (value >= 70) {
    const t = (89 - value) / 19;
    return direction * lerp(4, 14, t);
  }

  if (value >= 40) {
    const t = (69 - value) / 29;
    return direction * lerp(16, 34, t);
  }

  const t = (39 - value) / 39;
  return direction * lerp(36, 58, t);
}
