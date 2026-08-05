"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { fetchEvidenceEntries } from "@/lib/data/evidence";
import { buildEvidenceEntries } from "@/lib/evidence/build-evidence-entries";
import type { EvidenceEntry } from "@/lib/evidence/build-evidence-entries";
import { useApp } from "@/context/AppContext";

export function useEvidenceEntries(limit?: number): EvidenceEntry[] {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const { debriefHistory } = useApp();
  const [remoteEntries, setRemoteEntries] = useState<EvidenceEntry[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    void fetchEvidenceEntries(supabase, user.id).then(setRemoteEntries);
  }, [supabase, user, debriefHistory]);

  return useMemo(() => {
    const entries = user
      ? remoteEntries
      : buildEvidenceEntries(debriefHistory);

    return limit ? entries.slice(0, limit) : entries;
  }, [user, remoteEntries, debriefHistory, limit]);
}
