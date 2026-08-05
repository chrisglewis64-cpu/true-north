import { ReviewSubPage } from "@/components/review/ReviewSubPage";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function AnnualReviewPage() {
  return (
    <>
      <ReviewSubPage
        title="Annual Review"
        description="A full accounting of the year."
      />
      <BottomNav />
    </>
  );
}
