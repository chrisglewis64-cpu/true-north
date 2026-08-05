"use client";

import { ReviewProse, ReviewSection } from "@/components/review/ReviewSection";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";
import {
  getAlignmentReport,
  getCompassHeadingOption,
} from "@/lib/compass-data";
import { getHeadingFromAlignment } from "@/lib/compass/alignment";

type AlignmentReportContentProps = {
  showHeader?: boolean;
};

export function AlignmentReportContent({
  showHeader = true,
}: AlignmentReportContentProps) {
  const { established, alignment } = useCompassAlignment();
  const heading =
    established && alignment !== null
      ? getHeadingFromAlignment(alignment)
      : null;
  const option = heading ? getCompassHeadingOption(heading) : null;
  const report =
    established && alignment !== null ? getAlignmentReport(alignment) : null;

  if (!report) {
    return null;
  }

  return (
    <>
      {showHeader ? (
        <header className="mb-10 text-center">
          <SectionLabel>Alignment Report</SectionLabel>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Am I becoming the man I said I would become?
          </h2>
          {option ? (
            <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
              {option.description}
            </p>
          ) : null}
        </header>
      ) : null}

      <div className="space-y-10 sm:space-y-12">
        <ReviewSection label="Strongest Standard">
          <ReviewProse className="font-medium text-foreground">
            {report.strongestStandard}
          </ReviewProse>
        </ReviewSection>

        <ReviewSection label="Greatest Opportunity">
          <ReviewProse>{report.greatestOpportunity}</ReviewProse>
        </ReviewSection>

        <ReviewSection label="Current Drift">
          <ReviewProse>{report.currentDrift}</ReviewProse>
        </ReviewSection>

        <ReviewSection label="Suggested Course Correction">
          <ReviewProse className="font-medium">
            {report.suggestedCourseCorrection}
          </ReviewProse>
        </ReviewSection>

        <ReviewSection label="Mission Alignment">
          <ReviewProse>{report.missionAlignment}</ReviewProse>
        </ReviewSection>

        <ReviewSection label="Upcoming Focus">
          <ReviewProse className="font-medium">{report.upcomingFocus}</ReviewProse>
        </ReviewSection>
      </div>
    </>
  );
}
