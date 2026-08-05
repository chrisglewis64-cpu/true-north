"use client";

import { motion } from "framer-motion";
import { CompassDial } from "@/components/compass/CompassDial";
import { COMPASS_LAYOUT_ID, type CompassHeading } from "@/types/compass";

type CompassDisplayProps = {
  heading: CompassHeading;
  layoutId?: string;
  onOpen?: () => void;
};

/** Dial only — shared via layoutId for dashboard ↔ modal expansion. */
export function CompassDisplay({
  heading,
  layoutId = COMPASS_LAYOUT_ID,
  onOpen,
}: CompassDisplayProps) {
  const content = (
    <motion.div layoutId={layoutId} className="mx-auto w-[240px]">
      <CompassDial heading={heading} />
    </motion.div>
  );

  if (!onOpen) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="View alignment"
      className="mx-auto block w-[240px] cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      {content}
    </button>
  );
}
