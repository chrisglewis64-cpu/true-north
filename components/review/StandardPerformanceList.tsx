import type { StandardPerformanceEntry } from "@/types/review";

type StandardPerformanceListProps = {
  entries: StandardPerformanceEntry[];
};

function ratingClassName(rating: StandardPerformanceEntry["rating"]): string {
  switch (rating) {
    case "Strong":
      return "text-accent";
    case "Inconsistent":
      return "text-amber-400/90";
    case "Weak":
      return "text-red-400/80";
  }
}

export function StandardPerformanceList({
  entries,
}: StandardPerformanceListProps) {
  return (
    <ul className="space-y-3">
      {entries.map((entry) => (
        <li
          key={entry.order}
          className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0"
        >
          <div className="flex min-w-0 gap-3">
            <span className="mt-0.5 shrink-0 font-mono text-[11px] text-muted">
              {String(entry.order).padStart(2, "0")}
            </span>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {entry.statement}
            </p>
          </div>
          <span
            className={`shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-[11px] ${ratingClassName(entry.rating)}`}
          >
            {entry.rating}
          </span>
        </li>
      ))}
    </ul>
  );
}
