import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";

type ReviewSubPageProps = {
  title: string;
  description: string;
  backHref?: string;
};

export function ReviewSubPage({
  title,
  description,
  backHref = "/review",
}: ReviewSubPageProps) {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
      <header className="animate-fade-in">
        <Link
          href={backHref}
          className="inline-flex items-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          ← Review
        </Link>
        <SectionLabel>Review</SectionLabel>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
          {description}
        </p>
      </header>

      <section className="mt-12 animate-fade-in [animation-delay:80ms]">
        <div className="rounded-2xl border border-border bg-surface px-5 py-8 text-center sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
            Coming soon
          </p>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
            This review cadence is being prepared.
          </p>
        </div>
      </section>
    </main>
  );
}
