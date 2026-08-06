import type { CompassHeading } from "@/types/compass";
import {
  getCompassHeadingOption,
  getCompassHeadingTextClass,
} from "@/lib/compass-data";

type CompassHeadingLabelProps = {
  heading: CompassHeading;
  className?: string;
};

export function CompassHeadingLabel({
  heading,
  className = "",
}: CompassHeadingLabelProps) {
  const option = getCompassHeadingOption(heading);

  return (
    <p
      className={`font-mono text-sm font-medium uppercase tracking-[0.22em] sm:text-[15px] ${getCompassHeadingTextClass(heading)} ${className}`}
    >
      {option.label}
    </p>
  );
}
