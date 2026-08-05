import { BottomNav } from "@/components/navigation/BottomNav";
import { MissionStatusBadge } from "@/components/mission/MissionStatusBadge";
import { ReviewBackLink } from "@/components/review/ReviewBackLink";
import {
  ReviewProse,
  ReviewSection,
} from "@/components/review/ReviewSection";
import { StandardPerformanceList } from "@/components/review/StandardPerformanceList";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import { weeklyReviewPlaceholder } from "@/lib/review-placeholder-data";

export function WeeklyReviewPage() {
  const review = weeklyReviewPlaceholder;

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <ReviewBackLink />

        <header className="mb-10 mt-6 animate-fade-in">
          <SectionLabel>Review / Weekly</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Week of {review.weekLabel}
          </h1>
        </header>

        <div className="space-y-10 sm:space-y-12">
          <SectionCard className="animate-fade-in border-border-subtle p-6 sm:p-8 [animation-delay:60ms]">
            <div className="flex items-start justify-between gap-4">
              <SectionLabel>Mission</SectionLabel>
              <MissionStatusBadge status={review.missionStatus} />
            </div>
            <h2 className="mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
              {review.missionName}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              {review.missionPurpose}
            </p>
          </SectionCard>

          <ReviewSection
            label="Mission Intent"
            className="animate-fade-in [animation-delay:120ms]"
          >
            <ReviewProse className="font-medium text-foreground">
              {review.missionIntent}
            </ReviewProse>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              Success
            </p>
            <p className="mt-1 text-[15px] text-accent">{review.missionIntentSuccess}</p>
          </ReviewSection>

          <ReviewSection
            label="My Standard"
            className="animate-fade-in [animation-delay:180ms]"
          >
            <StandardPerformanceList entries={review.standardPerformance} />
          </ReviewSection>

          <ReviewSection
            label="Biggest Win"
            className="animate-fade-in [animation-delay:240ms]"
          >
            <ReviewProse>{review.biggestWin}</ReviewProse>
          </ReviewSection>

          <ReviewSection
            label="Biggest Lesson"
            className="animate-fade-in [animation-delay:300ms]"
          >
            <ReviewProse>{review.biggestLesson}</ReviewProse>
          </ReviewSection>

          <ReviewSection
            label="Course Correction"
            className="animate-fade-in [animation-delay:360ms]"
          >
            <ReviewProse>{review.courseCorrection}</ReviewProse>
          </ReviewSection>

          <ReviewSection
            label="Plan Next Week"
            className="animate-fade-in [animation-delay:420ms]"
          >
            <ReviewProse className="font-medium">{review.planNextWeek}</ReviewProse>
          </ReviewSection>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
