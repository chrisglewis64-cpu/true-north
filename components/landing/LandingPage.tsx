import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { MyStandardCard } from "@/components/landing/MyStandardCard";
import { currentCampaign } from "@/lib/placeholder-data";

export function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 pb-8 pt-12 sm:max-w-xl sm:px-8 sm:pt-16 lg:max-w-2xl lg:pt-20">
        <header className="animate-fade-in">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
            True North
          </p>
          <h1 className="mt-8 text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Who are you today?
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted sm:text-lg">
            Today is another opportunity to live your standard.
          </p>
        </header>

        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
          <MyStandardCard />

          <div className="animate-fade-in [animation-delay:160ms]">
            <SectionLabel>Current Campaign</SectionLabel>
            <p className="text-[17px] font-medium leading-relaxed tracking-tight text-foreground/90 sm:text-lg">
              {currentCampaign.statement}
            </p>
          </div>
        </div>
      </main>

      <footer className="animate-fade-in px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4 [animation-delay:240ms] sm:px-8">
        <div className="mx-auto w-full max-w-lg sm:max-w-xl lg:max-w-2xl">
          <Link
            href="/mission-intent"
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 active:opacity-80 sm:h-16 sm:text-[15px]"
          >
            Commit
          </Link>
        </div>
      </footer>
    </div>
  );
}
