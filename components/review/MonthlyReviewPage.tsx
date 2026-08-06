import { BottomNav } from "@/components/navigation/BottomNav";
import { ReviewBackLink } from "@/components/review/ReviewBackLink";
import {
  ReviewList,
  ReviewProse,
  ReviewSection,
} from "@/components/review/ReviewSection";
import { SectionLabel } from "@/components/ui/SectionCard";
import { monthlyReviewPlaceholder } from "@/lib/review-placeholder-data";

export function MonthlyReviewPage() {
  const review = monthlyReviewPlaceholder;

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <ReviewBackLink />

        <header className="mb-10 mt-6 animate-fade-in">
          <SectionLabel>Review / Monthly</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {review.monthLabel}
          </h1>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <ReviewSection
            label="Mission Progress"
            className="animate-fade-in [animation-delay:60ms]"
          >
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {review.missionName}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              {review.missionProgress}
            </p>
            <ReviewProse className="mt-4">{review.missionProgressNarrative}</ReviewProse>
          </ReviewSection>

          <ReviewSection
            label="Patterns"
            className="animate-fade-in [animation-delay:120ms]"
          >
            <ReviewList items={review.patterns} />
          </ReviewSection>

          <ReviewSection
            label="Achievements"
            className="animate-fade-in [animation-delay:180ms]"
          >
            <ReviewList items={review.achievements} />
          </ReviewSection>

          <ReviewSection
            label="Lessons"
            className="animate-fade-in [animation-delay:240ms]"
          >
            <ReviewList items={review.lessons} />
          </ReviewSection>

          <ReviewSection
            label="Priorities"
            className="animate-fade-in [animation-delay:300ms]"
          >
            <ReviewList items={review.priorities} ordered />
          </ReviewSection>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
