"use client";

import { useMemo, useState } from "react";
import { SectionLabel } from "@/components/ui/SectionCard";
import {
  MAX_STANDARDS,
  MIN_STANDARDS,
  STANDARD_EXAMPLES,
} from "@/lib/standards/constants";

type StandardsEditorProps = {
  initialStandards: string[];
  onChange: (standards: string[]) => void;
};

export function StandardsEditor({
  initialStandards,
  onChange,
}: StandardsEditorProps) {
  const [standards, setStandards] = useState<string[]>(
    initialStandards.length > 0 ? initialStandards : [...STANDARD_EXAMPLES],
  );
  const [draft, setDraft] = useState("");

  const countLabel = useMemo(
    () => `${standards.length} / ${MAX_STANDARDS}`,
    [standards.length],
  );

  function sync(next: string[]) {
    setStandards(next);
    onChange(next);
  }

  function handleAdd() {
    const value = draft.trim();
    if (!value || standards.length >= MAX_STANDARDS) {
      return;
    }

    sync([...standards, value]);
    setDraft("");
  }

  function handleUpdate(index: number, value: string) {
    sync(standards.map((item, itemIndex) => (itemIndex === index ? value : item)));
  }

  function handleRemove(index: number) {
    sync(standards.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionLabel>My Standard</SectionLabel>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {countLabel}
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-muted">
        My Standard is the code I choose to live by every day.
      </p>

      <ul className="space-y-3">
        {standards.map((standard, index) => (
          <li key={`${index}-${standard}`} className="flex gap-2">
            <input
              type="text"
              value={standard}
              onChange={(event) => handleUpdate(index, event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent/40"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded-xl border border-border px-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {standards.length < MAX_STANDARDS ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add your own standard"
            className="min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-foreground outline-none focus:border-accent/40"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-xl border border-border-subtle bg-surface px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground"
          >
            Add
          </button>
        </div>
      ) : null}

      <p className="text-[13px] text-muted">
        Choose between {MIN_STANDARDS} and {MAX_STANDARDS} standards before
        continuing.
      </p>
    </div>
  );
}

export function isValidStandardsCount(count: number): boolean {
  return count >= MIN_STANDARDS && count <= MAX_STANDARDS;
}
