"use client";

import { useState } from "react";
import {
  isValidStandardsCount,
  StandardsEditor,
} from "@/components/standards/StandardsEditor";
import { useProfile } from "@/context/ProfileContext";

export function StandardsSection() {
  const { standardStatements, saveStandards } = useProfile();
  const [standards, setStandards] = useState<string[]>(standardStatements);
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!isValidStandardsCount(standards.length)) {
      setMessage("Keep between 5 and 8 standards.");
      return;
    }

    setSaving(true);
    setMessage(undefined);
    const ok = await saveStandards(standards);
    setSaving(false);
    setMessage(ok ? "Standards updated." : "Unable to save standards.");
  }

  return (
    <section className="space-y-4">
      <StandardsEditor
        initialStandards={
          standards.length > 0 ? standards : standardStatements
        }
        onChange={setStandards}
      />
      {message ? <p className="text-[14px] text-foreground/80">{message}</p> : null}
      <button
        type="button"
        disabled={saving}
        onClick={() => void handleSave()}
        className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
      >
        {saving ? "Saving…" : "Save Standards"}
      </button>
    </section>
  );
}
