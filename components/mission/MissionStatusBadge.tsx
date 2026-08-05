import type { MissionStatus } from "@/types/mission";
import {
  getMissionStatusBadgeClasses,
  getMissionStatusOption,
} from "@/lib/mission-status";

type MissionStatusBadgeProps = {
  status: MissionStatus;
  className?: string;
};

export function MissionStatusBadge({
  status,
  className = "",
}: MissionStatusBadgeProps) {
  const option = getMissionStatusOption(status);

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.12em] sm:text-[11px] sm:tracking-[0.14em] ${getMissionStatusBadgeClasses(status)} ${className}`}
    >
      <span aria-hidden className="text-[10px] leading-none sm:text-[11px]">
        {option.emoji}
      </span>
      {option.label}
    </span>
  );
}
