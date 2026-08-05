import { CurrentMission } from "@/components/dashboard/CurrentMission";
import { SectionLabel } from "@/components/ui/SectionCard";
import { BottomNav } from "@/components/navigation/BottomNav";

export function CurrentMissionPageContent() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in mb-10">
          <SectionLabel>Mission</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Current Mission
          </h1>
        </header>

        <CurrentMission />
      </main>
      <BottomNav />
    </>
  );
}
