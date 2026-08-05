import Link from "next/link";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ReviewHubCard } from "@/components/review/ReviewHubCard";
import { SectionLabel } from "@/components/ui/SectionCard";
import { reviewHubMeta } from "@/lib/review-placeholder-data";

export function ReviewHubPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in mb-10">
          <SectionLabel>Review</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Reflection at every altitude.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Daily closes the day. Weekly course-corrects. Monthly reveals
            patterns. Annual confirms who you are becoming.
          </p>
        </header>

        <div className="space-y-4 sm:space-y-5">
          <ReviewHubCard
            cadence="Daily"
            title="Daily Debrief"
            period="Today"
            subtitle="Review My Standard. Close the day."
            href="/debrief"
            external
            delayClass="[animation-delay:60ms]"
          />
          <ReviewHubCard
            cadence="Weekly"
            title="Weekly Review"
            period={reviewHubMeta.weekly.period}
            subtitle={reviewHubMeta.weekly.subtitle}
            href="/review/weekly"
            delayClass="[animation-delay:120ms]"
          />
          <ReviewHubCard
            cadence="Monthly"
            title="Monthly Review"
            period={reviewHubMeta.monthly.period}
            subtitle={reviewHubMeta.monthly.subtitle}
            href="/review/monthly"
            delayClass="[animation-delay:180ms]"
          />
          <ReviewHubCard
            cadence="Annual"
            title="Annual Review"
            period={reviewHubMeta.annual.period}
            subtitle={reviewHubMeta.annual.subtitle}
            href="/review/annual"
            delayClass="[animation-delay:240ms]"
          />
        </div>

        <div className="animate-fade-in mt-10 text-center [animation-delay:300ms]">
          <Link
            href="/settings"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            Settings →
          </Link>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
