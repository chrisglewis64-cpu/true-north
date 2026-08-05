import { ReviewSubPage } from "@/components/review/ReviewSubPage";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function DailyReviewPage() {
  return (
    <>
      <ReviewSubPage
        title="Daily Review"
        description="Reflect on today before the debrief closes the loop."
      />
      <BottomNav />
    </>
  );
}
