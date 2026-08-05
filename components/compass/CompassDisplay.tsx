"use client";

import { motion } from "framer-motion";
import { CompassNeedle } from "@/components/compass/CompassNeedle";
import { COMPASS_LAYOUT_ID, type CompassHeading } from "@/types/compass";

type CompassDisplayProps = {
  heading: CompassHeading;
  layoutId?: string;
};

/** Dial only — shared via layoutId for dashboard ↔ modal expansion. */
export function CompassDisplay({
  heading,
  layoutId = COMPASS_LAYOUT_ID,
}: CompassDisplayProps) {
  return (
    <motion.div layoutId={layoutId} className="mx-auto w-[240px]">
      <CompassNeedle heading={heading} />
    </motion.div>
  );
}
