"use client";

import Link from "next/link";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Compass } from "@/components/compass/Compass";
import { AlignmentReportContent } from "@/components/compass/AlignmentReportContent";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";

export function AlignmentReportPage() {
  const { established, alignment, message } = useCompassAlignment();

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <Link
          href="/operations"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          ← Back
        </Link>

        <div className="animate-fade-in mb-10 mt-6 text-center [animation-delay:60ms]">
          <div className="mb-4">
            <SectionLabel>Current Heading</SectionLabel>
          </div>
          <Compass
            established={established}
            alignment={alignment}
            message={message}
            size="medium"
            showGuidance={!established}
          />
        </div>

        <AlignmentReportContent />
      </main>
      <BottomNav />
    </>
  );
}
