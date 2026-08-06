"use client";

import Link from "next/link";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Compass } from "@/components/compass/Compass";
import { AlignmentFocusContent } from "@/components/compass/AlignmentFocusContent";
import { useAlignmentFocus } from "@/hooks/useAlignmentFocus";
import { useIdentityAlignment } from "@/hooks/useIdentityAlignment";

export function AlignmentReportPage() {
  const { established, alignment, message, trend } = useIdentityAlignment();
  const focus = useAlignmentFocus();

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <Link
          href="/operations"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="animate-fade-in mb-10 mt-8 text-center [animation-delay:60ms]">
          <h1 className="text-[2rem] font-semibold tracking-[0.08em] text-foreground sm:text-[2.5rem]">
            TRUE NORTH
          </h1>
          <div className="mt-8">
            <Compass
              established={established}
              alignment={alignment}
              message={message}
              trendLabel={trend?.label}
              size="medium"
              showGuidance
            />
          </div>
        </div>

        <div className="animate-fade-in rounded-2xl border border-border bg-surface px-6 py-8 [animation-delay:120ms] sm:px-8">
          <AlignmentFocusContent focus={focus} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
