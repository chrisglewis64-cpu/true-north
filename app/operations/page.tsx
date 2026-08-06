import { CompassDashboard } from "@/components/dashboard/CourseStatus";
import { CurrentMission } from "@/components/dashboard/CurrentMission";
import { TodaysOnePercent } from "@/components/dashboard/TodaysOnePercent";
import { TodaysCommitment } from "@/components/dashboard/TodaysCommitment";
import { Evidence } from "@/components/dashboard/Evidence";
import { BottomNav } from "@/components/navigation/BottomNav";

function formatDate(): string {
  return new Intl.DateTimeFormat("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export default function OperationsPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <div className="space-y-10 sm:space-y-12">
          <TodaysCommitment />

          <time
            dateTime={new Date().toISOString().split("T")[0]}
            className="block font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
          >
            {formatDate()}
          </time>

          <CompassDashboard />
          <CurrentMission />
          <TodaysOnePercent />
          <Evidence />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
