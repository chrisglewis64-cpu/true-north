import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ReviewHubCard } from "@/components/review/ReviewHubCard";
import { SectionLabel } from "@/components/ui/SectionCard";
import { reviewHubMeta } from "@/lib/review-placeholder-data";

function ReviewSection({
  label,
  children,
  delayClass = "",
}: {
  label: string;
  children: ReactNode;
  delayClass?: string;
}) {
  return (
    <section className={`animate-fade-in ${delayClass}`}>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function ReviewHubPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in mb-12">
          <SectionLabel>Review</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Reflection.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            A calm place to close the day, course-correct the week, and remember
            who you are becoming.
          </p>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <ReviewSection label="Today" delayClass="[animation-delay:40ms]">
            <ReviewHubCard
              cadence="Daily"
              title="Daily Debrief"
              period="Today"
              subtitle="Review My Standard. Close the day."
              href="/debrief"
              external
            />
            <ReviewHubCard
              cadence="Intent"
              title="Current Intent"
              period="Today"
              subtitle="The commitment that sets your course."
              href="/mission-intent"
              actionLabel="→ Intent"
            />
            <ReviewHubCard
              cadence="Evidence"
              title="Evidence Captured"
              period="Today"
              subtitle="Proof that the standard was lived."
              href="/evidence"
              actionLabel="→ Evidence"
            />
          </ReviewSection>

          <ReviewSection label="This Week" delayClass="[animation-delay:100ms]">
            <ReviewHubCard
              cadence="Weekly"
              title="Weekly Review"
              period={reviewHubMeta.weekly.period}
              subtitle={reviewHubMeta.weekly.subtitle}
              href="/review/weekly"
            />
          </ReviewSection>

          <ReviewSection
            label="This Month"
            delayClass="[animation-delay:160ms]"
          >
            <ReviewHubCard
              cadence="Monthly"
              title="Monthly Review"
              period={reviewHubMeta.monthly.period}
              subtitle={reviewHubMeta.monthly.subtitle}
              href="/review/monthly"
            />
          </ReviewSection>

          <ReviewSection label="This Year" delayClass="[animation-delay:220ms]">
            <ReviewHubCard
              cadence="Annual"
              title="Annual Review"
              period={reviewHubMeta.annual.period}
              subtitle={reviewHubMeta.annual.subtitle}
              href="/review/annual"
            />
          </ReviewSection>
        </div>

        <div className="animate-fade-in mt-14 border-t border-border pt-10 text-center [animation-delay:280ms]">
          <Link
            href="/settings"
            className="inline-flex flex-col items-center gap-2"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Settings
            </span>
            <span className="text-[15px] text-foreground transition-colors hover:text-accent">
              Notifications, account, and preferences
            </span>
          </Link>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
