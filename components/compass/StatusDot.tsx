import { HEADING_DOT_CLASS, type CompassHeading } from "@/types/compass";

type StatusDotProps = {
  heading: CompassHeading;
  className?: string;
};

export function StatusDot({ heading, className = "" }: StatusDotProps) {
  return (
    <span
      aria-hidden
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${HEADING_DOT_CLASS[heading]} ${className}`}
    />
  );
}
