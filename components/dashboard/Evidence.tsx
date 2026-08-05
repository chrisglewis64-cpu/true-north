import { todaysEvidence } from "@/lib/placeholder-data";
import { SectionLabel } from "@/components/ui/SectionCard";

export function Evidence() {
  return (
    <section className="animate-fade-in [animation-delay:240ms]">
      <SectionLabel>Evidence</SectionLabel>
      <ul className="space-y-1">
        {todaysEvidence.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 py-3 border-b border-border last:border-0"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center text-accent">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 8.5l3.5 3.5 6.5-7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[15px] text-foreground/90 sm:text-base">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
