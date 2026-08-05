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
      className={`font-mono text-sm font-medium uppercase tracking-[0.2em] sm:text-base ${getCompassHeadingTextClass(heading)} ${className}`}
    >
      <span aria-hidden className="mr-2">
        {option.emoji}
      </span>
      {option.label}
    </p>
  );
}
