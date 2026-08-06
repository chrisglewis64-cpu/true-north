import { BottomNav } from "@/components/navigation/BottomNav";
import { ReviewBackLink } from "@/components/review/ReviewBackLink";
import {
  ReviewList,
  ReviewProse,
  ReviewSection,
} from "@/components/review/ReviewSection";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import { annualReviewPlaceholder } from "@/lib/review-placeholder-data";

export function AnnualReviewPage() {
  const review = annualReviewPlaceholder;

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <ReviewBackLink />

        <header className="mb-10 mt-6 animate-fade-in">
          <SectionLabel>Review / Annual</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {review.year}
          </h1>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <ReviewSection
            label="Completed Missions"
            className="animate-fade-in [animation-delay:60ms]"
          >
            <div className="space-y-4">
              {review.completedMissions.map((mission) => (
                <SectionCard key={mission.name} className="p-5 sm:p-6">
                  <p className="text-[15px] font-medium leading-relaxed text-foreground/90 sm:text-base">
                    {mission.name}
                  </p>
                  <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                    {mission.completedLabel}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {mission.lessonsLearned}
                  </p>
                </SectionCard>
              ))}
            </div>
          </ReviewSection>

          <ReviewSection
            label="Greatest Wins"
            className="animate-fade-in [animation-delay:120ms]"
          >
            <ReviewList items={review.greatestWins} />
          </ReviewSection>

          <ReviewSection
            label="Greatest Lessons"
            className="animate-fade-in [animation-delay:180ms]"
          >
            <ReviewList items={review.greatestLessons} />
          </ReviewSection>

          <ReviewSection
            label="Identity Growth"
            className="animate-fade-in [animation-delay:240ms]"
          >
            <ReviewProse className="text-[16px] leading-relaxed sm:text-[17px]">
              {review.identityGrowth}
            </ReviewProse>
          </ReviewSection>

          <ReviewSection
            label="Letter To Future Me"
            className="animate-fade-in [animation-delay:300ms]"
          >
            <SectionCard className="border-border-subtle bg-surface-elevated p-6 sm:p-8">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90 sm:text-base">
                {review.letterToFutureMe}
              </p>
              <p className="mt-8 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {review.letterSignedDate}
              </p>
            </SectionCard>
          </ReviewSection>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
