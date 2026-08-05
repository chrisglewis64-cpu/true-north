import { ReviewSubPage } from "@/components/review/ReviewSubPage";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function WeeklyReviewPage() {
  return (
    <>
      <ReviewSubPage
        title="Weekly Review"
        description="Assess the week and identify course corrections."
      />
      <BottomNav />
    </>
  );
}
