/** Polar position on a compass ring — 0° is north (top), angles increase clockwise. */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleDegFromNorthClockwise: number,
): { x: number; y: number } {
  const rad = (angleDegFromNorthClockwise * Math.PI) / 180;
  return {
    x: centerX + radius * Math.sin(rad),
    y: centerY - radius * Math.cos(rad),
  };
}

/** Tangent rotation (degrees) for clockwise travel at a given orbit angle. */
export function orbitTangentRotation(angleDegFromNorthClockwise: number): number {
  return angleDegFromNorthClockwise + 90;
}
