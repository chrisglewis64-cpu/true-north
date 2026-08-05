"use client";

import { useState } from "react";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useProfile } from "@/context/ProfileContext";

export function ProfileSection() {
  const { profile, updateDisplayName } = useProfile();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [message, setMessage] = useState<string>();
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    setMessage(undefined);
    const ok = await updateDisplayName(displayName.trim());
    setSaving(false);
    setMessage(ok ? "Display name updated." : "Unable to update display name.");
  }

  return (
    <section className="space-y-4">
      <SectionLabel>Profile</SectionLabel>
      <label className="block">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          Display Name
        </span>
        <input
          key={profile?.id ?? "profile"}
          type="text"
          defaultValue={profile?.displayName ?? ""}
          onChange={(event) => setDisplayName(event.target.value)}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-[15px] outline-none focus:border-accent/40"
        />
      </label>
      <p className="text-[13px] text-muted">{profile?.email}</p>
      {message ? <p className="text-[14px] text-foreground/80">{message}</p> : null}
      <button
        type="button"
        disabled={saving}
        onClick={() => void handleSave()}
        className="rounded-xl border border-border-subtle bg-surface px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground"
      >
        {saving ? "Saving…" : "Save Profile"}
      </button>
    </section>
  );
}
