"use client";

import { useState, type DragEvent } from "react";
import {
  MAX_STANDARDS,
  MIN_STANDARDS,
} from "@/lib/onboarding/example-standards";
import {
  ValidationMessage,
  ValidationSummary,
  fieldErrorClass,
} from "@/components/ui/ValidationMessage";

export type EditableStandard = {
  key: string;
  statement: string;
};

type StandardsEditorProps = {
  standards: EditableStandard[];
  onChange: (standards: EditableStandard[]) => void;
  error?: string;
};

export function StandardsEditor({
  standards,
  onChange,
  error,
}: StandardsEditorProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function updateStatement(index: number, statement: string) {
    onChange(
      standards.map((item, i) =>
        i === index ? { ...item, statement } : item
      )
    );
  }

  function addStandard() {
    if (standards.length >= MAX_STANDARDS) return;
    onChange([
      ...standards,
      { key: `new-${Date.now()}`, statement: "" },
    ]);
  }

  function deleteStandard(index: number) {
    if (standards.length <= 1) return;
    onChange(standards.filter((_, i) => i !== index));
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const next = [...standards];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setDragIndex(index);
    onChange(next);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  return (
    <div className="space-y-4">
      <ValidationSummary message={error} />

      <ul className="space-y-3">
        {standards.map((standard, index) => (
          <li
            key={standard.key}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={handleDragEnd}
            className={`rounded-2xl border bg-surface p-4 ${
              dragIndex === index ? "border-accent/50 opacity-80" : "border-border"
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Standard {index + 1} · Drag to reorder
              </p>
              <button
                type="button"
                onClick={() => deleteStandard(index)}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
              >
                Delete
              </button>
            </div>
            <input
              type="text"
              value={standard.statement}
              onChange={(event) => updateStatement(index, event.target.value)}
              placeholder="I …"
              className={`w-full rounded-xl border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-muted/60 focus:outline-none ${fieldErrorClass(false)}`}
            />
          </li>
        ))}
      </ul>

      {standards.length < MAX_STANDARDS ? (
        <button
          type="button"
          onClick={addStandard}
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          + Add standard
        </button>
      ) : null}

      <ValidationMessage
        message={
          standards.length < MIN_STANDARDS
            ? `Add at least ${MIN_STANDARDS} standards.`
            : undefined
        }
      />
    </div>
  );
}
