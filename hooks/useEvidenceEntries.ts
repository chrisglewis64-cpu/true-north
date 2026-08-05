"use client";

import { useMemo } from "react";
import { buildEvidenceEntries } from "@/lib/evidence/build-evidence-entries";
import { useApp } from "@/context/AppContext";

export function useEvidenceEntries(limit?: number) {
  const { debriefHistory } = useApp();

  const entries = useMemo(
    () => buildEvidenceEntries(debriefHistory),
    [debriefHistory]
  );

  if (limit === undefined) {
    return entries;
  }

  return entries.slice(0, limit);
}
