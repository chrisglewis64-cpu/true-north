import { SectionLabel } from "@/components/ui/SectionCard";
import { EvidenceSection } from "@/components/evidence/EvidenceList";
import { BottomNav } from "@/components/navigation/BottomNav";

export function EvidencePageContent() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <SectionLabel>Evidence</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Proof of Standard
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            All evidence captured from completed Daily Debriefs.
          </p>
        </header>

        <section className="mt-12 animate-fade-in [animation-delay:80ms]">
          <EvidenceSection showLabel={false} />
        </section>
      </main>
      <BottomNav />
    </>
  );
}
