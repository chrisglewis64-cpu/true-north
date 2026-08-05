import { ReviewSubPage } from "@/components/review/ReviewSubPage";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function MonthlyReviewPage() {
  return (
    <>
      <ReviewSubPage
        title="Monthly Review"
        description="Evaluate progress against your mission."
      />
      <BottomNav />
    </>
  );
}
