"use client";

import Link from "next/link";
import { use } from "react";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { MissionDetail } from "@/components/mission/MissionListItem";
import { BottomNav } from "@/components/navigation/BottomNav";

type MissionDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function MissionDetailPage({ params }: MissionDetailPageProps) {
  const { id } = use(params);
  const { getMissionById } = useTrueNorth();
  const mission = getMissionById(id);

  if (!mission) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16 text-center sm:max-w-xl">
        <p className="text-muted">Mission not found.</p>
        <Link href="/mission" className="mt-4 inline-block text-accent">
          Return to Missions
        </Link>
      </main>
    );
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <Link
          href="/mission"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
        >
          ← Back
        </Link>
        <div className="mt-6">
          <MissionDetail mission={mission} />
        </div>
      </main>
      <BottomNav />
    </>
  );
}
