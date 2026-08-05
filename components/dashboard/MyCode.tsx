import { theCode } from "@/lib/placeholder-data";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";

export function MyCode() {
  return (
    <SectionCard className="animate-fade-in [animation-delay:60ms]">
      <SectionLabel>My Code</SectionLabel>
      <ul className="space-y-3">
        {theCode.map((principle, index) => (
          <li
            key={principle}
            className="flex gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-muted font-mono text-[10px] text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {principle}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
