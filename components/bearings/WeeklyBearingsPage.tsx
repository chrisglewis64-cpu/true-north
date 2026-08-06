"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { listBearingLibrary } from "@/lib/bearings/library";
import { recommendWeeklyBearings } from "@/lib/bearings/recommend";
import { getWeekStart } from "@/lib/bearings/week";
import { buildEvidenceEntriesFromDebriefs } from "@/lib/evidence/build-evidence-entries";
import { useCompassAlignment } from "@/hooks/useCompassAlignment";

const MAX_WEEKLY = 3;

/**
 * Choose exactly three Bearings for the week.
 * Tiny identity corrections — not habits or tasks.
 */
export function WeeklyBearingsPage() {
  const {
    weeklyBearings,
    setWeeklyBearings,
    dailyDebriefHistory,
    missionIntentHistory,
    currentMission,
  } = useTrueNorth();
  const { established, alignment } = useCompassAlignment();
  const library = useMemo(() => listBearingLibrary(), []);

  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (weeklyBearings?.bearingIds?.length) {
      setSelected([...weeklyBearings.bearingIds]);
    }
  }, [weeklyBearings?.bearingIds]);

  function toggle(id: string) {
    setSaved(false);
    setSelected((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= MAX_WEEKLY) {
        return current;
      }
      return [...current, id];
    });
  }

  function handleRecommend() {
    const evidenceEntries = buildEvidenceEntriesFromDebriefs(
      dailyDebriefHistory,
      missionIntentHistory,
      currentMission?.name
    );
    const recommendation = recommendWeeklyBearings({
      alignment,
      established,
      dailyDebriefHistory,
      evidenceEntries,
      currentMission,
      previousWeeklyBearingIds: weeklyBearings?.bearingIds,
    });
    setSelected([...recommendation.bearingIds]);
    setSaved(false);
  }

  function handleSave() {
    if (selected.length !== MAX_WEEKLY) {
      return;
    }

    setWeeklyBearings({
      weekStart: getWeekStart(),
      bearingIds: [selected[0]!, selected[1]!, selected[2]!],
      selectedAt: new Date().toISOString(),
      source: "manual",
    });
    setSaved(true);
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in mb-8">
          <SectionLabel>Bearings</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Three corrections for the week.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            A Bearing is a tiny identity correction — like adjusting a compass.
            Never more than three. Memorable. Operational.
          </p>
        </header>

        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Selected {selected.length} of {MAX_WEEKLY}
        </p>

        <ul className="space-y-2">
          {library.map((bearing) => {
            const isSelected = selected.includes(bearing.id);
            const disabled = !isSelected && selected.length >= MAX_WEEKLY;

            return (
              <li key={bearing.id}>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => toggle(bearing.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors ${
                    isSelected
                      ? "border-accent/50 bg-accent-glow"
                      : "border-border bg-surface hover:border-border-subtle"
                  } ${disabled ? "opacity-40" : ""}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border font-mono text-[10px] ${
                      isSelected
                        ? "border-accent bg-accent text-white"
                        : "border-border-subtle text-muted"
                    }`}
                    aria-hidden
                  >
                    {isSelected ? "✓" : ""}
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground/90">
                    {bearing.statement}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-center text-[13px] leading-relaxed text-muted">
          Identity → Standards → Mission → Bearings → Evidence → Reflection →
          Growth
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/operations"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
          >
            Return to Compass →
          </Link>
        </p>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/90 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex w-full max-w-lg gap-3 sm:max-w-xl lg:max-w-2xl">
          <button
            type="button"
            onClick={handleRecommend}
            className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-border bg-surface font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:border-border-subtle sm:h-16"
          >
            Recommend
          </button>
          <button
            type="button"
            disabled={selected.length !== MAX_WEEKLY}
            onClick={handleSave}
            className="flex h-14 flex-[2] items-center justify-center rounded-2xl bg-accent font-mono text-sm font-medium uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:h-16"
          >
            {saved ? "Saved" : "Set Bearings"}
          </button>
        </div>
      </footer>
    </>
  );
}
