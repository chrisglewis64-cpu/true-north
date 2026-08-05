import Link from "next/link";
import { SectionCard } from "@/components/ui/SectionCard";

type ReviewHubCardProps = {
  cadence: string;
  title: string;
  period: string;
  subtitle: string;
  href: string;
  external?: boolean;
  delayClass?: string;
};

export function ReviewHubCard({
  cadence,
  title,
  period,
  subtitle,
  href,
  external = false,
  delayClass = "",
}: ReviewHubCardProps) {
  return (
    <Link href={href} className={`block animate-fade-in ${delayClass}`}>
      <SectionCard className="transition-colors hover:border-border-subtle">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {cadence}
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
          {period}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {external ? "→ Debrief" : "→ Review"}
        </p>
      </SectionCard>
    </Link>
  );
}
