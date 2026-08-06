import type { CompassHeading } from "@/types/compass";

/** Identity Alignment value (0–100). */
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
 * Maps Identity Alignment to discrete heading labels and colors.
 *
 * 95–100 True North · 85–94 slight drift · 70–84 noticeable ·
 * 50–69 clearly off · below 50 significantly misaligned
 */
export function getHeadingFromAlignment(
  alignment: CompassAlignment
): CompassHeading {
  const value = clampAlignment(alignment);

  if (value >= 95) return "true_north";
  if (value >= 85) return "drifting";
  if (value >= 70) return "off_course";
  return "lost";
}

/**
 * Maps Identity Alignment to needle rotation in degrees.
 * Movement stays subtle and elegant.
 */
export function getNeedleRotationFromAlignment(
  alignment: CompassAlignment
): number {
  const value = clampAlignment(alignment);
  const direction = needleDirection(value);

  // 95–100 → near True North (0–2°)
  if (value >= 95) {
    const t = (100 - value) / 5;
    return direction * lerp(0, 2, t);
  }

  // 85–94 → very slight drift (3–8°)
  if (value >= 85) {
    const t = (94 - value) / 9;
    return direction * lerp(3, 8, t);
  }

  // 70–84 → noticeable drift (9–20°)
  if (value >= 70) {
    const t = (84 - value) / 14;
    return direction * lerp(9, 20, t);
  }

  // 50–69 → clearly off course (21–36°)
  if (value >= 50) {
    const t = (69 - value) / 19;
    return direction * lerp(21, 36, t);
  }

  // Below 50 → significantly misaligned (37–55°)
  const t = (49 - value) / 49;
  return direction * lerp(37, 55, t);
}
